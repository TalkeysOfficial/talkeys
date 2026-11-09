// Seat and pass-type inventory: resolve what was requested, reserve it atomically, release it on failure.
const Event = require("../events/events.model.js");
const mongoose = require("mongoose");

const toObjectIdOrUndefined = (value) =>
  value && mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : undefined;

const normalizeEventPassTypes = (event) => {
  const eventObject = event.toObject ? event.toObject() : event;
  const passTypes = Array.isArray(eventObject.passTypes)
    ? eventObject.passTypes.filter(Boolean)
    : [];

  if (!passTypes.length) {
    return [
      {
        id: "general",
        name: "General Pass",
        price: Number(eventObject.ticketPrice || 0),
        description: "",
        totalQuantity: Number(eventObject.totalSeats || 0),
        maxAvailable: Number(eventObject.totalSeats || 0),
        soldQuantity: Number(eventObject.registrationCount || 0),
        bookedQuantity: Number(eventObject.registrationCount || 0),
        isActive: true,
        isLegacy: true,
      },
    ];
  }

  return passTypes.map((passType) => ({
    id: passType._id?.toString() || passType.id || "general",
    name: passType.name || "General Pass",
    price: Number(passType.price ?? eventObject.ticketPrice ?? 0),
    description: passType.description || "",
    totalQuantity: Number(passType.totalQuantity ?? passType.maxAvailable ?? 0),
    maxAvailable: Number(passType.maxAvailable ?? passType.totalQuantity ?? 0),
    soldQuantity: Number(passType.soldQuantity ?? passType.bookedQuantity ?? 0),
    bookedQuantity: Number(passType.bookedQuantity ?? passType.soldQuantity ?? 0),
    isActive: passType.isActive !== false,
    isLegacy: false,
  }));
};

const resolvePassType = (event, requestedPassType) => {
  const activePassTypes = normalizeEventPassTypes(event).filter(
    (passType) => passType.isActive,
  );

  if (!activePassTypes.length) {
    throw Object.assign(new Error("No active pass types are available"), {
      statusCode: 400,
    });
  }

  if (!requestedPassType) {
    return activePassTypes[0];
  }

  const requested = String(requestedPassType).trim().toLowerCase();
  const matchedPassType = activePassTypes.find((passType) => {
    const id = String(passType.id || "").toLowerCase();
    const name = String(passType.name || "").toLowerCase();

    return (
      id === requested ||
      name === requested ||
      (requested === "general" && name.includes("general"))
    );
  });

  if (!matchedPassType) {
    throw Object.assign(new Error("Selected pass type is not available"), {
      statusCode: 400,
    });
  }

  return matchedPassType;
};

const expandPassSelections = (event, passSelections = []) => {
  if (!Array.isArray(passSelections)) {
    return [];
  }

  const expandedPassTypes = [];
  passSelections.forEach((selection) => {
    // Cap per selection: the loop below allocates one array entry per ticket.
    const quantity = Math.min(Math.max(parseInt(selection?.quantity, 10) || 0, 0), 10);
    if (!quantity) return;

    const passType = resolvePassType(
      event,
      selection?.passTypeId || selection?.passType || selection?.passTypeName,
    );

    for (let index = 0; index < quantity; index += 1) {
      expandedPassTypes.push(passType);
    }
  });

  return expandedPassTypes.slice(0, 10);
};

const reserveSeats = async (eventId, ticketCount) => {
  return Event.findOneAndUpdate(
    {
      _id: eventId,
      $expr: {
        $lte: [
          { $add: [{ $ifNull: ["$registrationCount", 0] }, ticketCount] },
          "$totalSeats",
        ],
      },
    },
    { $inc: { registrationCount: ticketCount } },
    { returnDocument: "after" },
  );
};

const reservePassTypeSelections = async (eventId, passSelections = []) => {
  for (const selection of passSelections) {
    if (!selection.passTypeId || !selection.quantity) continue;

    const passTypeId = toObjectIdOrUndefined(selection.passTypeId);
    if (!passTypeId) continue;

    const reservedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        passTypes: {
          $elemMatch: {
            _id: passTypeId,
            isActive: true,
          },
        },
        $expr: {
          $let: {
            vars: {
              passType: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$passTypes",
                      as: "passType",
                      cond: { $eq: ["$$passType._id", passTypeId] },
                    },
                  },
                  0,
                ],
              },
            },
            in: {
              $or: [
                { $lte: [{ $ifNull: ["$$passType.totalQuantity", 0] }, 0] },
                {
                  $lte: [
                    {
                      $add: [
                        { $ifNull: ["$$passType.soldQuantity", 0] },
                        selection.quantity,
                      ],
                    },
                    { $ifNull: ["$$passType.totalQuantity", 0] },
                  ],
                },
              ],
            },
          },
        },
      },
      {
        $inc: {
          "passTypes.$.soldQuantity": selection.quantity,
          "passTypes.$.bookedQuantity": selection.quantity,
        },
      },
      { returnDocument: "after" },
    );

    if (!reservedEvent) {
      throw Object.assign(
        new Error(`${selection.passTypeName || "Selected pass"} is sold out`),
        { statusCode: 400 },
      );
    }
  }
};

const releasePassTypeSelections = async (eventId, passSelections = []) => {
  for (const selection of passSelections) {
    if (!selection.passTypeId || !selection.quantity) continue;

    const passTypeId = toObjectIdOrUndefined(selection.passTypeId);
    if (!passTypeId) continue;

    await Event.updateOne(
      {
        _id: eventId,
        "passTypes._id": passTypeId,
      },
      {
        $inc: {
          "passTypes.$.soldQuantity": -selection.quantity,
          "passTypes.$.bookedQuantity": -selection.quantity,
        },
      },
    );
  }
};

const reserveBookingInventory = async (event, ticketCount, passSelections) => {
  const reservedEvent = await reserveSeats(event._id, ticketCount);
  if (!reservedEvent) {
    throw Object.assign(new Error("Insufficient tickets available"), {
      statusCode: 400,
    });
  }

  try {
    await reservePassTypeSelections(event._id, passSelections);
  } catch (error) {
    await Event.findByIdAndUpdate(event._id, {
      $inc: { registrationCount: -ticketCount },
    });
    throw error;
  }

  return reservedEvent;
};

const releaseReservedSeats = async (pass) => {
  if (!pass?.seatsReserved) {
    return;
  }

  const ticketCount = pass.ticketCount || 1 + (pass.friends?.length || 0);
  await Event.findByIdAndUpdate(pass.eventId, {
    $inc: { registrationCount: -ticketCount },
  });
  await releasePassTypeSelections(pass.eventId, pass.passSelections || []);
  pass.seatsReserved = false;
};

module.exports = {
  toObjectIdOrUndefined,
  resolvePassType,
  expandPassSelections,
  reserveSeats,
  reserveBookingInventory,
  releaseReservedSeats,
};
