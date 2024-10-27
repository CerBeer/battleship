import { Rooms } from './rooms';
import { Users } from './users';

export type Database = {
  users: Users;
  rooms: Rooms;
};

export const database: Database = {
  users: new Users(),
  rooms: new Rooms(),
};
