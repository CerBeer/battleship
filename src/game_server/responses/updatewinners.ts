import { Database } from '../database/db';
import { responseTypes, ResponseTypes, sendMessage } from './responses';

export const updateWinners = (db: Database) => {
  const responseType = responseTypes.update_winners as ResponseTypes;
  const responseData = JSON.stringify(db.users.getAllWinners());
  const users = db.users.getAllOnlineUsers();
  users.forEach((user) => sendMessage(responseType, responseData, user.ws!));
};
