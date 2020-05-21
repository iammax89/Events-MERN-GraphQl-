const { queryEvents, createEvent } = require("./events");
const { queryBookings, bookEvent, cancelBooking } = require("./bookings");
const { createUser } = require("./users");
const { login } = require("./auth");

module.exports = {
  events: queryEvents,
  bookings: queryBookings,
  createEvent: createEvent,
  createUser: createUser,
  bookEvent: bookEvent,
  cancelBooking: cancelBooking,
  login: login,
};
