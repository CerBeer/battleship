import { turn } from 'game_server/responses/turn';
import { Database } from '../database/db';
import { Request, Answer, emptyAnswer } from './requests';
import { attack as attackResponse, ShotStatus } from 'game_server/responses/attack';
import { responseTemplate } from 'game_server/responses/attack';
import { Square } from 'game_server/database/games';
import { finish } from 'game_server/responses/finish';
import { updateWinners } from 'game_server/responses/updatewinners';

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
  const enemySquare = enemy!.square;
  const y = messageData.y;
  const x = messageData.x;

  if (CellStatus[enemySquare[y][x]] === 'full destroyed') {
    answer.isCorrect = false;
    answer.message = 'Skip shot on destroyed cell';
    return answer;
  }

  const shootResult = getShotResult(enemySquare, y, x);
  if (shootResult === 'miss') {
    db.games.nextTurn(game);
  }
  answer.isCorrect = true;
  answer.message = `Player ${player?.name} shot with result ${shootResult}`;

  const template = responseTemplate();
  template.position.x = x;
  template.position.y = y;
  template.status = shootResult;
  template.currentPlayer = messageData.indexPlayer;
  db.games.setAttackResult(game, template);
  attackResponse(game, template, db);

  const isWin = checkWin(enemySquare);
  if (isWin) {
    finish(game, messageData.indexPlayer, db);
    answer.message = answer.message + `\nPlayer ${player?.name} win!`;
    db.users.addScore(messageData.indexPlayer);
    db.games.deleteGame(game);
    updateWinners(db);
  } else {
    turn(game, db);
  }

  return answer;
};

const getShotResult = (enemySquare: Square, y: number, x: number): ShotStatus => {
  const enemyPositionStatus = enemySquare[y][x];

  let shootResult: ShotStatus = 'miss';
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

      xl = xl + (xl > 0 ? 1 : 0);
      xr = xr + (xr > 0 ? 1 : 0);
      yu = yu + (yu > 0 ? 1 : 0);
      yd = yd + (yd > 0 ? 1 : 0);
    }
    shootResult = isKill ? 'killed' : 'shot';
  }
  return shootResult;
};

const checkWin = (square: Square) => {
  let result = true;
  for (let i = 0; i < 10; i += 1) {
    for (let l = 0; l < 10; l += 1) {
      if (CellStatus[square[i][l]] === 'full') result = false;
    }
  }
  return result;
};

export default attack;
