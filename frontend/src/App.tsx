import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.scss";
import AuthPage from "./Auth/pages/Auth";
import EventPage from "./Events/pages/Events";
import BookingPage from "./Bookings/pages/Bookings";
import ResponsiveDrawer from "./common/Navigation/ResponsiveDrawer/ResponsiveDrawer";
import AuthContext from "./context/context";
import moment, { Moment } from "moment";

let logoutTimer: NodeJS.Timeout;
function App(): JSX.Element {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [tokenExpDate, setTokenExpDate] = useState<Moment>();
  const [modalOpen, setModalOpen] = useState(false);

  const loginHandler = useCallback(
    (token: string, userId: string, tokenExpiration: Moment) => {
      setToken(token);
      setUserId(userId);
      const tokenExpirationDate = tokenExpiration || moment().add(1, "hours");
      setTokenExpDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId,
          token,
          tokenExpiration: tokenExpirationDate,
        })
      );
    },
    []
  );

  useEffect(() => {
    const userDataJSON = localStorage.getItem("userData");
    if (userDataJSON) {
      const userData: {
        userId: string;
        token: string;
        tokenExpiration: Moment;
      } = JSON.parse(userDataJSON);
      if (userData.token) {
        loginHandler(userData.token, userData.userId, userData.tokenExpiration);
      }
    }
  }, [loginHandler]);

  const logoutHandler = useCallback(() => {
    setToken("");
    setUserId("");
  }, []);
  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = moment(tokenExpDate).diff(moment(), "milliseconds");
      logoutTimer = setTimeout(() => logoutHandler(), remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logoutHandler, tokenExpDate]);
  const openModalHandler = () => setModalOpen(true);
  const closeModalHandler = () => setModalOpen(false);
  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          token,
          userId,
          login: loginHandler,
          logout: logoutHandler,
          openModal: openModalHandler,
          closeModal: closeModalHandler,
          isModalOpen: modalOpen,
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
