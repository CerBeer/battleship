import { User } from 'game_server/database/users';
import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';
import { ResponseTypes, responseTypes, sendMessage } from 'game_server/responses/responses';
import { reg as responseReg } from 'game_server/responses/reg';

const reg = (request: Request, db: Database): Answer => {
  const answer = emptyAnswer();
  answer.ident = 'User reg';
  const newUser = db.users.userFromUserWs(request.data as User, request.ws!);
  const result = db.users.reg(newUser);
  answer.isCorrect = result.isCorrect;
  answer.message = result.message;

  if (request.ws) {
    const responseType = responseTypes.reg as ResponseTypes;
    const responseData = responseReg(result);
    sendMessage(responseType, responseData, request.ws);
  }

  return answer;
};

export default reg;
