import { Room } from './rooms';

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type MessageDataShips = {
  gameId: number;
  ships: Ship[];
  indexPlayer: string;
};

export type GameUser = { name: string; index: string; ships: Ship[] };

export const gameUser = (): GameUser => {
  return {
    name: '',
    index: '',
    ships: [],
  };
};

export type Game = {
  idGame: number;
  gameUsers: GameUser[];
  attacking: number;
};

export const emptyGame = (): Game => {
  return {
    idGame: 0,
    gameUsers: [],
    attacking: 0,
  };
};

export type GameMessage = {
  isCorrect: boolean;
  game: Game;
  message: string;
};

export const gameMessage = (): GameMessage => {
  return {
    isCorrect: false,
    game: emptyGame(),
    message: '',
  };
};

export class Games {
  private _nextIndex = 1;
  private _records: Map<number, Game> = new Map();
  private _instance: Games;

  public constructor() {
    if (!this._instance) this._instance = this;
    return this._instance;
  }

  public createGame = (room: Room): GameMessage => {
    const result = gameMessage();

    if (room.roomUsers.length < 2) {
      result.isCorrect = false;
      result.message = 'Failed to create game. Not all users in room';
      return result;
    }

    const check = this.checkUsersAlreadyInGame(room);
    if (check) {
      result.isCorrect = false;
      result.message = 'Failed to create game. User already in game';
      return result;
    }

    room.roomUsers.forEach((user) => {
      const player = gameUser();
      player.name = user.name;
      player.index = user.index;
      result.game.gameUsers.push(player);
    });
    result.game.idGame = this._nextIndex;
    result.isCorrect = true;
    this._records.set(result.game.idGame, result.game);
    this._nextIndex += 1;
    return result;
  };

  checkUsersAlreadyInGame = (room: Room): boolean => {
    let result = false;
    this._records.forEach((record: Game) => {
      room.roomUsers.forEach((userRoom) => {
        if (record.gameUsers.filter((user) => user.index === userRoom.index).length) result = true;
      });
    });
    return result;
  };

  public getGameByIndex = (index: number): GameMessage => {
    const result = gameMessage();
    if (!index) {
      result.isCorrect = false;
      result.message = 'Incorrect Game index received';
      return result;
    }
    const game = this._records.get(index);
    if (!game) {
      result.isCorrect = false;
      result.message = 'Game not found';
      return result;
    }
    result.isCorrect = true;
    result.game = game;

    return result;
  };

  public setUserShips = (messageData: MessageDataShips): GameMessage => {
    const result = gameMessage();
    if (!messageData.gameId) {
      result.isCorrect = false;
      result.message = 'Incorrect Game gameId received';
      return result;
    }
    const game = this._records.get(messageData.gameId);
    if (!game) {
      result.isCorrect = false;
      result.message = 'Game not found';
      return result;
    }
    const player = game.gameUsers.find((user) => user.index === messageData.indexPlayer);
    if (!player) {
      result.isCorrect = false;
      result.message = 'Player not found in game';
      return result;
    }
    player.ships = messageData.ships;
    result.isCorrect = true;
    result.message = `Player ${player.name} added ships`;
    result.game = game;

    return result;
  };
}
