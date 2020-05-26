import React, { FC, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import BookingsContext from "../../context/booking-context";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";
const BookingsChart: FC = () => {
  const { bookings } = useContext(BookingsContext);
  const chartData = bookings.map((booking) => ({
    event: booking.event.title,
    price: booking.event.price,
  }));
  return (
    <Paper>
      <Chart data={chartData}>
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries valueField="price" argumentField="event" />
        <Title text="Bookings" />
        <Animation />
      </Chart>
    </Paper>
  );
};

export default BookingsChart;
