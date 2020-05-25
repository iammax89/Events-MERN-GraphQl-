import React, { FC, useContext, Fragment } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { useStyles } from "../hook/useStyle";
import { NavLink, useHistory } from "react-router-dom";
import EventIcon from "@material-ui/icons/Event";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AuthContext from "../../../context/context";
export const DrawerContent: FC = () => {
  const { token, logout } = useContext(AuthContext);
  const classes = useStyles();
  let navLinks = token ? ["Events", "Bookings"] : ["Events", "Authenticate"];
  let history = useHistory();
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
  const logoutHandler = () => {
    logout();
    history.push("/auth");
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
        {token && (
          <Fragment>
            <Divider />
            <ListItem button onClick={logoutHandler}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItem>
          </Fragment>
        )}
      </List>
    </div>
  );
};
