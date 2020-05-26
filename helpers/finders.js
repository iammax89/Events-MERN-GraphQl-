const { transformedEvent } = require("./transformers");
const { dateToISOString } = require("./date");
const Event = require("../models/event");
const User = require("../models/user");
const DataLoader = require("dataloader");

const eventLoader = new DataLoader((eventIds) => {
  return Event.find({
    _id: { $in: eventIds },
  });
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const findUser = async (userId) => {
  try {
    let user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user._doc._id.toString(),
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw new Error("User not found.");
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
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
