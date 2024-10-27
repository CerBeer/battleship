import { GameMessage } from 'game_server/database/games';
import { Database } from '../database/db';
import { responseTypes, ResponseTypes, sendMessage } from './responses';

export const createGame = (gameMessage: GameMessage, db: Database) => {
  const responseType = responseTypes.create_game as ResponseTypes;
  const dataTemplate = {
    idGame: gameMessage.game.idGame,
    idPlayer: '',
  };

  const users = gameMessage.game.gameUsers;
  users.forEach((user) => {
    const player = db.users.getUserByIndex(user.index);
    dataTemplate.idPlayer = player.user.index;
    const responseData = JSON.stringify(dataTemplate);
    sendMessage(responseType, responseData, player.user.ws!);
  });
};
