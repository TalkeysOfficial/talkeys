// Booking: validates a booking, reserves inventory, then creates a free pass or a pending pass with a PhonePe order.
const Event = require("../events/events.model.js");
const Pass = require("./passes.model.js");
const Team = require("../teams/teams.model.js");
const User = require("../auth/users.model.js");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { createPhonePeOrder } = require("./phonepe.service.js");
const {
  toObjectIdOrUndefined,
  resolvePassType,
  expandPassSelections,
  reserveBookingInventory,
  releaseReservedSeats,
} = require("./inventory.service.js");

const basicPassRequiredEventIds = () =>
  String(process.env.BASIC_PASS_REQUIRED_EVENT_IDS || "")
    .split(",")
    .map((eventId) => eventId.trim())
    .filter(Boolean);

const sanitizeFriends = (friends = []) => {
  if (!Array.isArray(friends)) {
    return [];
  }

  return friends.slice(0, 9).map((friend) => ({
    name: String(friend?.name || "Friend").trim().slice(0, 80) || "Friend",
    email: friend?.email ? String(friend.email).trim().slice(0, 120) : undefined,
    phone: friend?.phone ? String(friend.phone).trim().slice(0, 20) : undefined,
  }));
};

const getTeamBooking = async (event, userId, teamCode) => {
  if (!event.isTeamEvent) {
    return null;
  }

  if (!teamCode) {
    throw Object.assign(new Error("Team code is required for this event"), {
      statusCode: 400,
    });
  }

  const team = await Team.findOne({
    eventId: event._id,
    teamCode: String(teamCode).trim().toUpperCase(),
  });

  if (!team) {
    throw Object.assign(new Error("Team not found"), { statusCode: 404 });
  }

  const isMember = team.teamMembers.some(
    (member) => member.userId.toString() === userId.toString(),
  );
  if (!isMember) {
    throw Object.assign(new Error("User is not a member of this team"), {
      statusCode: 403,
    });
  }

  return team;
};

const teamMembersToFriends = (team, userId) =>
  team.teamMembers
    .filter((member) => member.userId.toString() !== userId.toString())
    .map((member) => ({
      name: member.name,
      email: member.email,
      phone: member.phoneNumber,
    }));

const sanitizeAttendees = (user, baseFriends = [], body = {}) => {
  const requestedAttendees = Array.isArray(body.attendees)
    ? body.attendees.slice(0, 10)
    : [];

  const sourcePeople = requestedAttendees.length
    ? requestedAttendees
    : [
        {
          name: user?.name || "Main User",
          email: user?.email,
          phone: user?.phoneNumber,
        },
        ...baseFriends,
      ];

  const sanitized = sourcePeople.slice(0, 10).map((person, index) => {
    const name = String(person?.name || "").trim();

    return {
      name:
        name ||
        (index === 0 ? user?.name || "Main User" : `Attendee ${index + 1}`),
      email: person?.email ? String(person.email).trim().slice(0, 120) : undefined,
      phone: person?.phone ? String(person.phone).trim().slice(0, 20) : undefined,
      personType: index === 0 ? "user" : "friend",
      personIndex: index,
      requestedPassType:
        person?.passTypeId || person?.passType || person?.passTypeName,
    };
  });

  return sanitized.length
    ? sanitized
    : [
        {
          name: user?.name || "Main User",
          email: user?.email,
          phone: user?.phoneNumber,
          personType: "user",
          personIndex: 0,
        },
      ];
};

const buildBookingDetails = (event, user, baseFriends, body = {}) => {
  const attendees = sanitizeAttendees(user, baseFriends, body);
  const expandedPassTypes = expandPassSelections(event, body.passSelections);

  while (expandedPassTypes.length > attendees.length && attendees.length < 10) {
    attendees.push({
      name: `Attendee ${attendees.length + 1}`,
      personType: attendees.length === 0 ? "user" : "friend",
      personIndex: attendees.length,
    });
  }

  const defaultPassValue =
    body.passTypeId || body.passType || body.passTypeName || undefined;

  const attendeeDetails = attendees.map((attendee, index) => {
    const selectedPassType = resolvePassType(
      event,
      attendee.requestedPassType ||
        expandedPassTypes[index]?.id ||
        expandedPassTypes[index]?.name ||
        defaultPassValue,
    );
    const passPrice = event.isPaid ? selectedPassType.price : 0;
    const passTypeId = toObjectIdOrUndefined(selectedPassType.id);

    return {
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      personType: attendee.personType || (index === 0 ? "user" : "friend"),
      personIndex: index,
      passTypeId,
      passTypeName: selectedPassType.name,
      passPrice,
    };
  });

  const friends = attendeeDetails.slice(1).map((attendee) => ({
    name: attendee.name,
    email: attendee.email,
    phone: attendee.phone,
  }));

  const selectionMap = new Map();
  attendeeDetails.forEach((attendee) => {
    const key = attendee.passTypeId?.toString() || attendee.passTypeName;
    const current = selectionMap.get(key) || {
      passTypeId: attendee.passTypeId,
      passTypeName: attendee.passTypeName,
      passPrice: attendee.passPrice,
      quantity: 0,
    };
    current.quantity += 1;
    selectionMap.set(key, current);
  });

  const passSelections = Array.from(selectionMap.values());
  const totalAmount = attendeeDetails.reduce(
    (sum, attendee) => sum + attendee.passPrice,
    0,
  );

  return {
    attendees: attendeeDetails,
    friends,
    passSelections,
    totalAmount,
    primaryPassType: passSelections[0],
  };
};

const buildQRStrings = (user, friends = [], attendeeDetails = []) => {
  const attendees = attendeeDetails.length
    ? attendeeDetails
    : [
        {
          name: user?.name || "Main User",
          personType: "user",
          personIndex: 0,
          passTypeName: "General Pass",
          passPrice: 0,
        },
        ...friends.slice(0, 9).map((friend, index) => ({
          name: friend.name || `Friend ${index + 1}`,
          personType: "friend",
          personIndex: index + 1,
          passTypeName: "General Pass",
          passPrice: 0,
        })),
      ];

  return attendees.slice(0, 10).map((attendee, index) => ({
    id: uuidv4(),
    personType: attendee.personType || (index === 0 ? "user" : "friend"),
    personIndex: attendee.personIndex ?? index,
    personName: attendee.name || (index === 0 ? user?.name || "Main User" : `Friend ${index}`),
    passTypeId: attendee.passTypeId,
    passTypeName: attendee.passTypeName || "General Pass",
    passPrice: attendee.passPrice || 0,
    qrScanned: false,
    scannedAt: null,
  }));
};

const createBooking = async (userId, body) => {
  let pass;
  try {
    if (!userId || !body.eventId) {
      throw Object.assign(new Error("User ID and Event ID are required"), { statusCode: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(body.eventId)) {
      throw Object.assign(new Error("Invalid Event ID"), { statusCode: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    const event = await Event.findById(body.eventId);
    if (!event) {
      throw Object.assign(new Error("Event not found"), { statusCode: 404 });
    }
    if (event.status !== "published" || event.isRegistrationOpen === false) {
      throw Object.assign(new Error("Registration is not open for this event"), { statusCode: 400 });
    }
    const existing = await Pass.exists({
      userId: userId,
      eventId: event._id,
      $or: [
        { status: "active" },
        { status: "pending", expiresAt: { $gt: new Date() } },
      ],
    });
    if (existing) {
      throw Object.assign(new Error("You already have a pass for this event"), { statusCode: 409 });
    }
    if (basicPassRequiredEventIds().includes(body.eventId)) {
      const basicPass = await Pass.findOne({
        userId: userId,
        paymentStatus: "completed",
      });

      if (!basicPass) {
        throw Object.assign(new Error("Can't Book Y2K Pass without Basic Registration Pass"), { statusCode: 404 });
      }
    }

    const team = await getTeamBooking(event, userId, body.teamCode);
    const baseFriends = team
      ? teamMembersToFriends(team, userId)
      : sanitizeFriends(body.friends);
    const {
      attendees,
      friends,
      passSelections,
      totalAmount,
      primaryPassType,
    } = buildBookingDetails(event, user, baseFriends, body);
    const totalTicketsNeeded = attendees.length;
    const amountInPaisa = Math.round(totalAmount * 100);
    const isPaidBooking = Boolean(event.isPaid && amountInPaisa > 0);

    await reserveBookingInventory(event, totalTicketsNeeded, passSelections);

    // Generate unique merchant order ID with timestamp
    const merchantOrderId = `TKT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    pass = new Pass({
      userId: userId,
      eventId: body.eventId,
      passType: primaryPassType?.passTypeName || "General Pass",
      passTypeId: primaryPassType?.passTypeId,
      passTypeName: primaryPassType?.passTypeName || "General Pass",
      passPrice: primaryPassType?.passPrice || 0,
      passSelections,
      status: isPaidBooking ? "pending" : "active",
      passStatus: isPaidBooking ? "inactive" : "active",
      paymentStatus: isPaidBooking ? "pending" : "completed",
      merchantOrderId,
      amount: totalAmount,
      ticketCount: totalTicketsNeeded,
      seatsReserved: true,
      friends,
      attendees,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    });

    if (!isPaidBooking) {
      pass.confirmedAt = new Date();
      pass.paymentDetails = {
        amount: 0,
        completedAt: new Date(),
        source: "free_registration",
        merchantOrderId,
      };
      pass.qrStrings = buildQRStrings(user, friends, attendees);
      await pass.save();

      return {
        message: "Free pass created successfully",
        data: {
          passId: pass._id,
          passUUID: pass.passUUID,
          merchantOrderId,
          amount: totalAmount,
          amountInPaisa,
          totalTickets: totalTicketsNeeded,
          paymentRequired: false,
          paymentUrl: null,
          passSelections,
          attendees,
          event: {
            id: event._id,
            title: event.name,
            date: event.startDate,
            venue: event.location,
          },
          qrStrings: pass.qrStrings,
          friends,
        },
      };
    }

    await pass.save();

    const orderData = {
      merchantOrderId,
      amount: amountInPaisa,
      userId: userId.toString(),
      eventId: body.eventId,
      eventName: event.name,
      passType: primaryPassType?.passTypeName || "General Pass",
      passSelections,
      attendees,
      friends,
      mobileNumber: user.phoneNumber,
    };

    let paymentOrder;
    try {
      paymentOrder = await createPhonePeOrder(orderData);
    } catch (error) {
      pass.status = "payment_failed";
      pass.passStatus = "inactive";
      pass.paymentStatus = "failed";
      pass.paymentDetails = {
        amount: amountInPaisa,
        failedAt: new Date(),
        source: "order_creation",
        reason: error.message,
        merchantOrderId,
      };
      await releaseReservedSeats(pass);
      await pass.save();
      throw error;
    }

    pass.phonePeOrderId = paymentOrder.data?.orderId || paymentOrder.orderId;
    pass.paymentUrl =
      paymentOrder.data?.redirectUrl || paymentOrder.redirectUrl;
    await pass.save();

    return {
      message: "Payment order created successfully",
      data: {
        passId: pass._id,
        merchantOrderId: merchantOrderId,
        phonePeOrderId: paymentOrder.data?.orderId || paymentOrder.orderId,
        amount: totalAmount,
        amountInPaisa: amountInPaisa,
        totalTickets: totalTicketsNeeded,
        paymentRequired: true,
        paymentUrl: paymentOrder.data?.redirectUrl || paymentOrder.redirectUrl,
        expiresAt: pass.expiresAt,
        passSelections,
        attendees,
        event: {
          id: event._id,
          title: event.name,
          date: event.startDate,
          venue: event.location,
        },
        qrStrings: [],
        friends,
      },
    };
  } catch (error) {
    if (!error.statusCode && pass?.seatsReserved && pass.paymentStatus !== "completed") {
      try {
        await releaseReservedSeats(pass);
        if (!pass.isNew) {
          await pass.save();
        }
      } catch (releaseError) {
        console.error("Seat reservation release failed:", releaseError);
      }
    }
    throw error;
  }
};

module.exports = { basicPassRequiredEventIds, sanitizeFriends, buildQRStrings, createBooking };
