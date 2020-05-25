import React, { FC, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import {
  Toolbar,
  IconButton,
  Typography,
  Breadcrumbs,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import { useStyles } from "../hook/useStyle";
import { NavLink, useHistory } from "react-router-dom";

import AuthContext from "../../../context/context";

interface ToolbarNavProps {
  handleDrawerToggle: () => void;
}

export const ToolbarNav: FC<ToolbarNavProps> = ({ handleDrawerToggle }) => {
  const { token, logout } = useContext(AuthContext);
  let history = useHistory();
  const classes = useStyles();
  let navLinks = token ? ["Events", "Bookings"] : ["Events", "Authenticate"];

  const logoutHandler = () => {
    logout();
    history.push("/auth");
  };
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Events-App
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" className={classes.sectionDesktop}>
          {navLinks.map((text) => (
            <Button color="inherit" key={text}>
              <NavLink to={`${text.toLowerCase()}`}>{text}</NavLink>
            </Button>
          ))}
          {token && (
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Breadcrumbs>
      </Toolbar>
    </AppBar>
  );
};
