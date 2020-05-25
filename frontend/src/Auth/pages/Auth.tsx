import React, { FC, useState, ChangeEvent, FormEvent, useContext } from "react";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core";
import myClasses from "./Auth.module.scss";
import AuthContext from "../../context/context";

type AuthData = {
  userId: string;
  token: string;
  tokenExpiration: number;
};
const AuthPage: FC = () => {
  const [emailState, setEmailState] = useState({
    value: "",
    error: false,
  });
  const [passwordState, setPasswordState] = useState({
    value: "",
    error: false,
  });
  const [isLogin, setIsLogin] = useState(true);

  const { login, logout } = useContext(AuthContext);
  const emailInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const emailRegEx: RegExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
    setEmailState({
      value: event.target.value,
      error: !emailRegEx.test(event.target.value),
    });
  };

  const passwordInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPasswordState({
      value: event.target.value,
      error: event.target.value.length < 6,
    });
  };
  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    const loginBody = {
      query: `query {
        login(email: "${emailState.value}", password: "${passwordState.value}") {
          userId
          token
          tokenExpiration
        }
      }`,
    };
    const createUserBody = {
      query: `mutation {
        createUser(userInput: {email: "${emailState.value}" password: "${passwordState.value}"}) {
          _id
          email
        }
      }
      `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(!isLogin ? createUserBody : loginBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res?.status !== 200 && res?.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((data) => {
        if (isLogin) {
          const authData: AuthData = data["data"].login;
          return login(
            authData.token,
            authData.userId,
            authData.tokenExpiration
          );
        }
        // const newUserData = data["data"].createUser;
      })
      .catch((err) => console.log(err));
  };

  const swithcModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    if (isLogin) {
      logout();
    }
  };

  return (
    <form action="" className={myClasses.authForm} onSubmit={submitHandler}>
      <FormControl className={myClasses.formControl} error={emailState.error}>
        <InputLabel htmlFor="email">Email address</InputLabel>
        <Input
          value={emailState.value}
          id="email"
          type="email"
          onChange={(event) => emailInputHandler(event)}
        />
      </FormControl>
      <FormControl
        className={myClasses.formControl}
        error={passwordState.error}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          value={passwordState.value}
          id="password"
          type="password"
          onChange={(event) => passwordInputHandler(event)}
        />
      </FormControl>
      <div className={myClasses.formActions}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            emailState.error ||
            passwordState.error ||
            !emailState.value.length ||
            !passwordState.value.length
          }
        >
          Submit
        </Button>
        <Button variant="outlined" color="primary" onClick={swithcModeHandler}>
          {`Switch to ${isLogin ? "Signup" : "Signin"}`}
        </Button>
      </div>
    </form>
  );
};
export default AuthPage;
