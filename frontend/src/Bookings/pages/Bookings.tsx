import React, { FC, useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/context";
import { IBooking } from "../../models/booking";
import { LinearProgress } from "@material-ui/core";
import BoocingsContext from "../context/booking-context";
import BookingTabs from "../components/bookings-tabs/BookingsTabs";
const BookingPage: FC = () => {
  const { token } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const fetchBookings = useCallback(() => {
    setIsLoading(true);
    const requestBody = {
      query: `query {
        bookings {
          _id
          event {
            _id
            title
            date
            price
          }
          user {
            _id
            email
          }
          createdAt
          updatedAt
        }
      }
      `,
    };
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res?.status !== 200 && res?.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((data) => data["data"]["bookings"])
      .then((bookings: IBooking[]) => {
        console.log(bookings);
        setIsLoading(false);
        setBookings(bookings);
      })
      .catch((err) => console.log(err));
  }, [token]);
  useEffect(() => {
    fetchBookings();
    return setBookings([]);
  }, [fetchBookings]);
  return isLoading ? (
    <LinearProgress />
  ) : (
    <BoocingsContext.Provider
      value={{
        bookings: bookings,
        fetchBookings: fetchBookings,
      }}
    >
      <BookingTabs></BookingTabs>
    </BoocingsContext.Provider>
  );
};
export default BookingPage;
