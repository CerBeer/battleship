import { Users } from './users';

export type Database = {
  users: Users;
};

export const database: Database = {
  users: new Users(),
};

export type DbMessage = {
  object: Users;
  message: string;
};
