import React, { FC, useContext } from "react";
import { IBooking } from "../../../models/booking";
import Context from "../../../context/context";
import moment from "moment";
import {
  makeStyles,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});
interface BookingsTableProps {
  bookings: IBooking[];
  fetchBookings: () => void;
}

const BookingsTable: FC<BookingsTableProps> = ({ bookings, fetchBookings }) => {
  const classes = useStyles();
  const { userId, token } = useContext(Context);

  const cancelBookingHandler = (id: string) => {
    const requestBody = {
      query: `mutation {
        cancelBooking(bookingId:"${id}"){
          _id
        }
      }`,
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
      .then((data) => data["data"]["cancelBooking"])
      .then(() => fetchBookings())
      .catch((err) => console.log(err));
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell align="center">Created</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings
            .filter((booking) => booking.user._id === userId)
            .map((booking) => (
              <TableRow key={booking._id}>
                <TableCell component="th" scope="row">
                  {booking.event.title}
                </TableCell>
                <TableCell align="center">
                  {moment(booking.createdAt).format("DD/MM/yyyy")}
                </TableCell>
                <TableCell align="center">
                  <Button
                    color="secondary"
                    onClick={() => cancelBookingHandler(booking._id)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingsTable;
