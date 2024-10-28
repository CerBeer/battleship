import { turn } from 'game_server/responses/turn';
import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';
import { attack as attackResponse, shotStatus } from 'game_server/responses/attack';
import { responseTemplate } from 'game_server/responses/attack';

type MessageData = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: string;
};

const CellStatus = ['empty', 'empty attacked', 'full', 'full destroyed'];

const attack = (request: Request, db: Database): Answer => {
  const answer = emptyAnswer();
  answer.ident = 'Attack';

  const messageData = request.data as MessageData;

  const gameMessage = db.games.getGameByIndex(messageData.gameId);
  answer.isCorrect = gameMessage.isCorrect;
  answer.message = gameMessage.message;
  if (!gameMessage.isCorrect) {
    return answer;
  }

  const game = gameMessage.game;
  const checkPlayer = db.games.checkTurn(game, messageData.indexPlayer);
  answer.isCorrect = checkPlayer.isCorrect;
  answer.message = checkPlayer.message;
  if (!checkPlayer.isCorrect) {
    return answer;
  }

  const player = game.gameUsers.find((user) => user.index === messageData.indexPlayer);
  const enemy = game.gameUsers.find((user) => user.index !== messageData.indexPlayer);
  // const square = player!.square;
  const enemySquare = enemy!.square;
  const y = messageData.y;
  const x = messageData.x;
  const enemyPositionStatus = enemySquare[y][x];

  let shootResult: shotStatus = 'miss';
  if (enemyPositionStatus === CellStatus.indexOf('full')) {
    let xl = 1;
    let xr = 1;
    let yu = 1;
    let yd = 1;
    let isKill = true;
    while (xl + xr + yu + yd > 0 && isKill) {
      if (y - yu < 0) yu = 0;
      if (y + yd > 9) yd = 0;
      if (x - xl < 0) xl = 0;
      if (x + xr > 9) xr = 0;
      if (yu > 0 && enemySquare[y - yu][x] === 2) isKill = false;
      if (yd > 0 && enemySquare[y + yd][x] === 2) isKill = false;
      if (xl > 0 && enemySquare[y][x - xl] === 2) isKill = false;
      if (xr > 0 && enemySquare[y][x + xr] === 2) isKill = false;
      if (enemySquare[y - yu][x] < 2) yu = 0;
      if (enemySquare[y + yd][x] < 2) yd = 0;
      if (enemySquare[y][x - xl] < 2) xl = 0;
      if (enemySquare[y][x + xr] < 2) xr = 0;
      // console.log({ xl, xr, yu, yd, isKill });
      // console.log(enemySquare[y - yu][x]);
      // console.log(enemySquare[y + yd][x]);
      // console.log(enemySquare[y][x - xl]);
      // console.log(enemySquare[y][x + xr]);

      xl = xl + (xl > 0 ? 1 : 0);
      xr = xr + (xr > 0 ? 1 : 0);
      yu = yu + (yu > 0 ? 1 : 0);
      yd = yd + (yd > 0 ? 1 : 0);
    }
    shootResult = isKill ? 'killed' : 'shot';
  } else {
    db.games.nextTurn(game);
  }

  answer.isCorrect = true;
  answer.message = `Player ${player?.name} shot with result ${shootResult}`;
  // console.log({ shootResult });

  const template = responseTemplate();
  template.position.x = x;
  template.position.y = y;
  template.status = shootResult;
  template.currentPlayer = messageData.indexPlayer;
  attackResponse(game, template, db);
  turn(game, db);

  return answer;
};

export default attack;
