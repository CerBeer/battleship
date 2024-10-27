import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';

const regOut = (request: Request, db: Database): Answer => {
  const answer = emptyAnswer();
  answer.ident = 'User reg out';
  const foundUser = db.users.getUserByWs(request.ws!);
  // console.log({ foundUser });
  if (!foundUser.isCorrect) {
    answer.isCorrect = true;
    // answer.message = foundUser.message;
    return answer;
  }
  const result = db.users.regOut(foundUser.user);
  answer.isCorrect = result.isCorrect;
  answer.message = result.message;
  return answer;
};

export default regOut;
