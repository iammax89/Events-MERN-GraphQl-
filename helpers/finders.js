const { transformedEvent } = require("./transformers");
const { dateToISOString } = require("./date");
const Event = require("../models/event");
const User = require("../models/user");

const events = async (eventIds) => {
  try {
    let events = await Event.find({
      _id: { $in: eventIds },
    });
    return events.map((event) => transformedEvent(event));
  } catch (error) {
    throw error;
  }
};

const findUser = async (userId) => {
  try {
    let user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user._doc._id.toString(),
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw new Error("User not found.");
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event._doc._id.toString(),
      date: dateToISOString(event._doc.date),
      creator: findUser.bind(this, event.creator),
    };
  } catch (error) {
    throw error;
  }
};
module.exports.findUser = findUser;
module.exports.singleEvent = singleEvent;
