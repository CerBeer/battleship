import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';
import { ResponseTypes, responseTypes, sendMessage } from 'game_server/responses/responses';

const createRoom = (request: Request, db: Database): Answer => {
  const answer = emptyAnswer();
  answer.ident = 'Create new room';

  const userMessage = db.users.getUserByWs(request.ws!);
  // console.log({ userMessage });
  if (!userMessage.isCorrect) {
    answer.isCorrect = false;
    answer.message = userMessage.message;
    return answer;
  }
  const roomUser = db.rooms.roomUserFormUser(userMessage.user);
  const result = db.rooms.createRoom(roomUser);
  answer.isCorrect = result.isCorrect;
  answer.message = result.message;

  if (result.isCorrect) {
    const responseType = responseTypes.update_room as ResponseTypes;
    const availableRooms = db.rooms.getAvailableRooms();
    const responseData = JSON.stringify(availableRooms);
    const users = db.users.getAllOnlineUsers();
    // console.log({ users });
    users.forEach((user) => sendMessage(responseType, responseData, user.ws!));
  }

  return answer;
};

export default createRoom;
