import { createContext } from "react";
import { IBooking } from "../../models/booking";

export default createContext({
  bookings: [] as IBooking[],
  fetchBookings: () => {},
});
