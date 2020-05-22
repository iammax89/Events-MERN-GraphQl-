import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.scss";
import AuthPage from "./Auth/pages/Auth";
import EventPage from "./Events/pages/Evants";
import BookingPage from "./Bookings/pages/Bookings";
import ResponsiveDrawer from "./common/Navigation/ResponsiveDrawer/ResponsiveDrawer";
import AuthContext from "./context/auth";
function App(): JSX.Element {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  const loginHandler = (
    token: string,
    userId: string,
    tokenExpiration: number
  ) => {
    setToken(token);
    setUserId(userId);
  };

  const logoutHandler = () => {
    setToken("");
    setUserId("");
  };
  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          token,
          userId,
          login: loginHandler,
          logout: logoutHandler,
        }}
      >
        <ResponsiveDrawer>
          <Switch>
            {!token && <Route path="/auth" component={AuthPage} exact />}
            <Route path="/events" component={EventPage} exact />
            {token && <Route path="/bookings" component={BookingPage} exact />}
            {!token && <Redirect from="/" to="/auth" />}
            {token && <Redirect from="/auth" to="/events" />}
            {token && <Redirect from="/" to="/events" />}
          </Switch>
        </ResponsiveDrawer>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
