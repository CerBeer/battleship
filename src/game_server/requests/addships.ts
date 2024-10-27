import { turn } from 'game_server/responses/turn';
import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';
import { MessageDataShips } from 'game_server/database/games';
import { startGame } from 'game_server/responses/startgame';

const addShips = (request: Request, db: Database): Answer => {
  const answer = emptyAnswer();
  answer.ident = 'Add ships';

  const messageData = request.data as MessageDataShips;
  const gameMessage = db.games.setUserShips(messageData);
  answer.isCorrect = gameMessage.isCorrect;
  answer.message = gameMessage.message;
  if (!gameMessage.isCorrect) {
    return answer;
  }

  const game = gameMessage.game;
  const allPlayersShips = game.gameUsers.reduce((result, user) => {
    result = result && user.ships.length === 10;
    return result;
  }, true);
  if (allPlayersShips) {
    startGame(game, db);
    turn(game, db);
    answer.message = answer.message + '\nGame started';
  }

  return answer;
};

export default addShips;
