import { Game } from 'game_server/database/games';
import { Database } from '../database/db';
import { responseTypes, ResponseTypes, sendMessage } from './responses';

export const turn = (game: Game, db: Database) => {
  const responseType = responseTypes.turn as ResponseTypes;
  const player = game.gameUsers[game.attacking];
  const data = {
    currentPlayer: player.index,
  };
  const responseData = JSON.stringify(data);
  game.gameUsers.forEach((gameUser) => {
    const user = db.users.getUserByIndex(gameUser.index).user;
    sendMessage(responseType, responseData, user.ws!);
  });
};
