import { User } from 'game_server/database/users';
import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';

const reg = (request: Request, db: Database): Answer => {
  const answer = emptyAnswer();
  answer.ident = 'User reg';
  const newUser = db.users.userFromUserWs(request.data as User, request.ws!);
  const result = db.users.reg(newUser);
  answer.isCorrect = result.isCorrect;
  answer.message = result.message;
  return answer;
};

export default reg;
