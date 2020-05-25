import React, { FC, useContext } from "react";
import { FetchedEvent } from "../../../models/event";
import {
  makeStyles,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Button,
} from "@material-ui/core";
import moment from "moment";
import Context from "../../../context/context";
interface EventsTableProps {
  events: FetchedEvent[];
  isLoading: boolean;
  viewDetail: (id: string) => void;
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  small: {
    display: "block",
  },
});
const EventsTable: FC<EventsTableProps> = ({
  events,
  isLoading,
  viewDetail,
}) => {
  const classes = useStyles();
  const { userId } = useContext(Context);
  return isLoading ? (
    <LinearProgress />
  ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeader}>Title</TableCell>
            <TableCell align="center" className={classes.tableHeader}>
              Date
            </TableCell>
            <TableCell align="center" className={classes.tableHeader}>
              Price&nbsp;($)
            </TableCell>
            <TableCell align="center" className={classes.tableHeader}>
              Details
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event._id}>
              <TableCell component="th" scope="row">
                {event.title}
              </TableCell>
              <TableCell align="center">
                {moment(event.date).format("DD/MM/yyyy")}
              </TableCell>
              <TableCell align="center">{event.price}</TableCell>
              <TableCell align="center">
                {userId === event.creator._id ? (
                  <small className={classes.small}>This is your event.</small>
                ) : (
                  <Button size="small" onClick={() => viewDetail(event._id)}>
                    View Details
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventsTable;
