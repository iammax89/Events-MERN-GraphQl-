import { createContext } from "react";

export default createContext({
  token: "",
  userId: "",
  login: (token: string, userId: string, tokenExpiration: number) => {},
  logout: () => {},
  openModal: () => {},
  closeModal: () => {},
  isModalOpen: false,
});
