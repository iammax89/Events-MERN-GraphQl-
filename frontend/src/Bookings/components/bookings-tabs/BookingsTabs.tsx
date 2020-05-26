import React, { FC } from "react";
import { makeStyles, Theme, AppBar, Tabs, Tab } from "@material-ui/core";
import { BookingsTab } from "../bookings-tab/BookingTab";
import BookingsTable from "../bookings-table/BookingTable";
import BookingsChart from "../bookings-chart/BookingsChart";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BookingTabs: FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Bookings" {...a11yProps(0)} />
          <Tab label="Chart" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <BookingsTab value={value} index={0}>
        <BookingsTable />
      </BookingsTab>
      <BookingsTab value={value} index={1}>
        <BookingsChart />
      </BookingsTab>
    </div>
  );
};

export default BookingTabs;
