import { Log } from "./log.model";

export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  logs: Log[];
  createdAt: Date;
  oAuth: boolean;
}
