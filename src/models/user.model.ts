import { Session } from './session.model'

export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  session: Session[];
  createdAt: Date;
}
