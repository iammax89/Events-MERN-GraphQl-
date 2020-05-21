const { dateToISOString } = require("../../helpers/date");
const { transformedEvent } = require("../../helpers/transformers");
const Event = require("../../models/event");
const User = require("../../models/user");

exports.queryEvents = async () => {
  try {
    let events = await Event.find();
    return events.map((event) => transformedEvent(event));
  } catch (error) {
    throw error;
  }
};

exports.createEvent = async (args, req) => {
  if (!req.isAuth) {
    throw new Error("Unauthenticated!");
  }
  const event = new Event({
    title: args.eventInput.title,
    describtion: args.eventInput.describtion,
    price: parseFloat(args.eventInput.price),
    date: dateToISOString(args.eventInput.date),
    creator: req.userId,
  });
  let createdEvent;
  try {
    const res = await event.save();
    createdEvent = transformedEvent(res);
    let user = await User.findById(req.userId);
    await user.createdEvents.push(event);
    if (!user) {
      throw new Error("Could not find the user.");
    }
    await user.save();
    return createdEvent;
  } catch (error) {
    throw error;
  }
};
