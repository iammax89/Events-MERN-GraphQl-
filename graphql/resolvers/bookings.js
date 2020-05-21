const { transformedBooking } = require("../../helpers/transformers");
const { singleEvent } = require("../../helpers/finders");
const Booking = require("../../models/booking");
const Event = require("../../models/event");

exports.queryBookings = async (args, req) => {
  if (!req.isAuth) {
    throw new Error("Unauthenticated!");
  }
  try {
    const bookings = await Booking.find();
    return bookings.map((booking) => transformedBooking(booking));
  } catch (error) {
    throw error;
  }
};

exports.bookEvent = async (args, req) => {
  if (!req.isAuth) {
    throw new Error("Unauthenticated!");
  }
  try {
    const fetchedEvent = await Event.findById(args.eventId);
    const booking = new Booking({
      event: fetchedEvent,
      user: req.userId,
    });
    const res = await booking.save();
    return transformedBooking(res);
  } catch (error) {}
};

exports.cancelBooking = async (args, req) => {
  if (!req.isAuth) {
    throw new Error("Unauthenticated!");
  }
  try {
    const fetchedBooking = await Booking.findById(args.bookingId);
    const event = singleEvent(fetchedBooking.event);
    await Booking.deleteOne({
      _id: args.bookingId,
    });
    return event;
  } catch (error) {
    throw error;
  }
};
