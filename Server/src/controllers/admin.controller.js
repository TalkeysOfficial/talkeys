const mongoose = require("mongoose");
const Event = require("../models/events.model");
const Pass = require("../models/passes.model");

const getTicketCount = (pass) =>
  pass.ticketCount || 1 + (pass.friends?.length || 0);

const getCheckedInCount = (pass) =>
  (pass.qrStrings || []).filter((qrString) => qrString.qrScanned).length;

const getPassTypeName = (value) =>
  String(value || "").trim() || "General Pass";

const getPassTypeKey = (value) => getPassTypeName(value).toLowerCase();

const addPassTypeCount = (counts, name, quantity) => {
  const key = getPassTypeKey(name);
  counts.set(key, (counts.get(key) || 0) + quantity);
};

const getPassTypeCounts = (pass) => {
  const counts = new Map();

  if (pass.passSelections?.length) {
    pass.passSelections.forEach((selection) => {
      addPassTypeCount(
        counts,
        selection.passTypeName || pass.passTypeName || pass.passType,
        Number(selection.quantity || 0),
      );
    });
    return counts;
  }

  if (pass.qrStrings?.length) {
    pass.qrStrings.forEach((qrString) => {
      addPassTypeCount(
        counts,
        qrString.passTypeName || pass.passTypeName || pass.passType,
        1,
      );
    });
    return counts;
  }

  if (pass.attendees?.length) {
    pass.attendees.forEach((attendee) => {
      addPassTypeCount(
        counts,
        attendee.passTypeName || pass.passTypeName || pass.passType,
        1,
      );
    });
    return counts;
  }

  addPassTypeCount(
    counts,
    pass.passTypeName || pass.passType,
    getTicketCount(pass),
  );
  return counts;
};

const collectPassTypeCounts = (passes) => {
  const counts = new Map();

  passes.forEach((pass) => {
    getPassTypeCounts(pass).forEach((quantity, key) => {
      counts.set(key, (counts.get(key) || 0) + quantity);
    });
  });

  return counts;
};

const serializeAttendees = (pass) => {
  const buyerName = pass.userId?.name || "Unknown user";

  if (pass.qrStrings?.length) {
    return pass.qrStrings.map((qrString) => ({
      id: qrString.id || qrString._id?.toString(),
      name: qrString.personType === "user" ? buyerName : qrString.personName,
      type: qrString.personType,
      passTypeName: qrString.passTypeName || pass.passTypeName || pass.passType || "General Pass",
      passPrice: qrString.passPrice ?? pass.passPrice ?? 0,
      checkedIn: Boolean(qrString.qrScanned),
      checkedInAt: qrString.scannedAt || null,
    }));
  }

  return [
    {
      id: pass._id.toString(),
      name: buyerName,
      type: "user",
      passTypeName: pass.passTypeName || pass.passType || "General Pass",
      passPrice: pass.passPrice || 0,
      checkedIn: Boolean(pass.isScanned),
      checkedInAt: pass.timeScanned || null,
    },
  ];
};

const serializeBooking = (pass) => {
  const attendees = serializeAttendees(pass);

  return {
    id: pass._id.toString(),
    passUUID: pass.passUUID || null,
    bookedAt: pass.createdAt,
    confirmedAt: pass.confirmedAt || pass.paymentDetails?.completedAt || null,
    buyer: {
      id: pass.userId?._id?.toString() || null,
      name: pass.userId?.name || "Unknown user",
      email: pass.userId?.email || "",
      phoneNumber: pass.userId?.phoneNumber || "",
      image: pass.userId?.image || "",
    },
    amount: pass.amount || 0,
    ticketCount: getTicketCount(pass),
    passType: pass.passTypeName || pass.passType,
    passTypeName: pass.passTypeName || pass.passType,
    passSelections: pass.passSelections || [],
    passStatus: pass.passStatus,
    status: pass.status,
    paymentStatus: pass.paymentStatus,
    merchantOrderId: pass.merchantOrderId || "",
    phonePeOrderId: pass.phonePeOrderId || "",
    friends: pass.friends || [],
    attendees,
    checkedInCount: attendees.filter((attendee) => attendee.checkedIn).length,
  };
};

exports.getEventStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(eventId)
      .select(
        "name category mode location startDate startTime totalSeats registrationCount photographs isPaid ticketPrice passTypes isLive",
      )
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const passes = await Pass.find({
      eventId,
      paymentStatus: "completed",
    })
      .populate("userId", "name email phoneNumber image")
      .sort({ createdAt: -1 })
      .lean();

    const pendingPasses = await Pass.find({
      eventId,
      paymentStatus: "pending",
      seatsReserved: true,
      expiresAt: { $gt: new Date() },
    })
      .select(
        "ticketCount friends passSelections passType passTypeName qrStrings attendees",
      )
      .lean();

    const bookings = passes.map(serializeBooking);
    const completedPassTypeCounts = collectPassTypeCounts(passes);
    const pendingPassTypeCounts = collectPassTypeCounts(pendingPasses);
    const totalOrders = bookings.length;
    const totalTickets = bookings.reduce(
      (total, booking) => total + booking.ticketCount,
      0,
    );
    const checkedInCount = bookings.reduce(
      (total, booking) => total + booking.checkedInCount,
      0,
    );
    const amountCollected = bookings.reduce(
      (total, booking) => total + booking.amount,
      0,
    );
    const pendingReservedTickets = pendingPasses.reduce(
      (total, pass) => total + getTicketCount(pass),
      0,
    );
    const passTypes = (event.passTypes || []).map((passType) => {
      const key = getPassTypeKey(passType.name);

      return {
        ...passType,
        soldQuantity: completedPassTypeCounts.get(key) || 0,
        bookedQuantity: completedPassTypeCounts.get(key) || 0,
        pendingQuantity: pendingPassTypeCounts.get(key) || 0,
        rawSoldQuantity: passType.soldQuantity || 0,
        rawBookedQuantity: passType.bookedQuantity || 0,
      };
    });

    return res.status(200).json({
      message: "Event stats fetched successfully",
      data: {
        event: {
          id: event._id.toString(),
          name: event.name,
          category: event.category,
          mode: event.mode,
          location: event.location || "",
          startDate: event.startDate,
          startTime: event.startTime,
          totalSeats: event.totalSeats,
          registrationCount: event.registrationCount || 0,
          photograph: event.photographs?.[0] || "",
          isPaid: event.isPaid,
          ticketPrice: event.ticketPrice || 0,
          passTypes,
          isLive: event.isLive,
        },
        stats: {
          totalOrders,
          totalTickets,
          checkedInCount,
          amountCollected,
          seatsRemaining: Math.max((event.totalSeats || 0) - totalTickets, 0),
          pendingReservedTickets,
        },
        bookings,
      },
    });
  } catch (error) {
    console.error("Admin event stats error:", error);
    return res.status(500).json({
      message: "Failed to fetch event stats",
      error: error.message,
    });
  }
};
