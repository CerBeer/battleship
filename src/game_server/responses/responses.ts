import { WebSocket } from 'ws';

export const responseTypes = {
  empty: 'empty',
  reg: 'reg',
  update_winners: 'update_winners',
  create_game: 'create_game',
  update_room: 'update_room',
  start_game: 'start_game',
  attack: 'attack',
  turn: 'turn',
  finish: 'finish',
};

export type ResponseTypes = keyof typeof responseTypes;

export type Response = {
  type: '';
  data: string;
  id: 0;
};

export const newResponse = (type: string, data: string) => {
  return JSON.stringify({
    type,
    data,
    id: 0,
  });
};

export const sendMessage = (type: ResponseTypes, data: string, cws: WebSocket) => {
  const message = newResponse(type, data);
  cws.send(message);
  // console.log(`Sent message: ${message}`);
};
