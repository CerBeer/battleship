import { updateRoom } from 'game_server/responses/updateroom';
import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';

type MessageData = {
  indexRoom: number;
};

const addUserToRoom = (request: Request, db: Database): Answer => {
  const answer = emptyAnswer();
  answer.ident = 'Add user to room';

  const userMessage = db.users.getUserByWs(request.ws!);
  // console.log({ userMessage });
  if (!userMessage.isCorrect) {
    answer.isCorrect = false;
    answer.message = userMessage.message;
    return answer;
  }
  const roomUser = db.rooms.roomUserFromUser(userMessage.user);
  const roomData = request.data as MessageData;
  const result = db.rooms.addUserToRoom(roomData.indexRoom, roomUser);
  answer.isCorrect = result.isCorrect;
  answer.message = result.message;

  if (result.isCorrect) {
    answer.message = `User ${userMessage.user.name} added to room`;
    const roomMessage = db.rooms.closeRoom(roomData.indexRoom);
    if (!roomMessage.isCorrect) {
      answer.isCorrect = result.isCorrect;
      answer.message = result.message;
      return answer;
    }
    updateRoom(db);
  }

  return answer;
};

export default addUserToRoom;
