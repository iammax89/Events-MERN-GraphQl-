import { createContext } from "react";
import { Moment } from "moment";

export default createContext({
  token: "",
  userId: "",
  login: (token: string, userId: string, tokenExpiration: Moment) => {},
  logout: () => {},
  openModal: () => {},
  closeModal: () => {},
  isModalOpen: false,
});
