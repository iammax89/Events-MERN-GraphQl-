const { dateToISOString } = require("./date");
const { findUser, singleEvent } = require("./finders");

const transformedEvent = (event) => ({
  ...event._doc,
  _id: event._doc._id.toString(),
  date: dateToISOString(event._doc.date),
  creator: findUser.bind(this, event.creator),
});

const transformedBooking = (booking) => ({
  ...booking._doc,
  _id: booking._doc._id.toString(),
  user: findUser.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToISOString(booking._doc.createdAt),
  updatedAt: dateToISOString(booking._doc.updatedAt),
});

exports.transformedEvent = transformedEvent;
exports.transformedBooking = transformedBooking;
