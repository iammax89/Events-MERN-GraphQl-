import { FetchedEvent } from "./event";
import { IUser } from "./user";

export interface IBooking {
  _id: string;
  event: FetchedEvent;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}
