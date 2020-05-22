import React, { FC, useContext } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { useStyles } from "../hook/useStyle";
import { NavLink } from "react-router-dom";
import EventIcon from "@material-ui/icons/Event";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AuthContext from "../../../context/auth";
export const DrawerContent: FC = () => {
  const { token } = useContext(AuthContext);
  const classes = useStyles();
  let navLinks = token ? ["Events", "Bookings"] : ["Events", "Authenticate"];
  const renderIcon = (text: string) => {
    switch (text) {
      case "Events":
        return <EventIcon />;
      case "Bookings":
        return <TurnedInIcon />;
      case "Authenticate":
        return <AccountBoxIcon />;
    }
  };
  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {navLinks.map((text) => (
          <ListItem button key={text}>
            <NavLink to={`/${text.toLowerCase()}`}>
              <ListItemIcon>{renderIcon(text)}</ListItemIcon>
              <ListItemText primary={text} />
            </NavLink>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
