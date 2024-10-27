import { WebSocket } from 'ws';
import { Database } from '../database/db';
import reg from './reg';
import regOut from './regout';

export const requestTypes = {
  empty: 'empty',
  regOut: 'regOut',
  reg: 'reg',
  create_room: 'create_room',
  add_user_to_room: 'add_user_to_room',
  add_ships: 'add_ships',
  attack: 'attack',
  randomAttack: 'randomAttack',
};

export type Request = {
  isCorrect: boolean;
  type: keyof typeof requestTypes;
  data: object;
  id: number;
  ws: WebSocket | null;
  answer: string;
};

export type Answer = {
  isCorrect: boolean;
  ident: string;
  message: string;
};

export const emptyAnswer = (): Answer => {
  return {
    isCorrect: false,
    ident: '',
    message: '',
  };
};

export const emptyRequest: Request = {
  isCorrect: false,
  type: requestTypes.empty as Request['type'],
  data: {},
  id: 0,
  ws: null,
  answer: 'Not allowed',
};

const parseRequest = (requestData: string, userWs: WebSocket) => {
  const result = emptyRequest;
  result.ws = userWs;
  let message = {};
  try {
    message = JSON.parse(requestData);
  } catch {
    return result;
  }
  const { type, data, id } = message as Request;
  if (!requestTypes.hasOwnProperty(type) || !data) {
    return result;
  }
  // console.log({ type, data, id });
  try {
    if (data) result.data = JSON.parse(data as unknown as string);
  } catch {
    return result;
  }
  result.type = type;
  result.id = id;
  result.isCorrect = true;
  return result;
};

export const processingRequest = (requestData: string, userWs: WebSocket, db: Database) => {
  const message = parseRequest(requestData, userWs);
  // console.log({ message });
  if (!message.isCorrect) {
    if (message.answer) console.error(message.answer);
    return;
  }
  let result = undefined;
  switch (message.type) {
    case requestTypes.reg:
      result = reg(message, db);
      break;
    case requestTypes.regOut:
      result = regOut(message, db);
      break;
    case requestTypes.create_room:
      {
      }
      break;
    case requestTypes.add_user_to_room:
      {
      }
      break;
    case requestTypes.add_ships:
      {
      }
      break;
    case requestTypes.attack:
      {
      }
      break;
    case requestTypes.randomAttack:
      {
      }
      break;
    default:
      result = emptyAnswer();
      result.message = `Message ${message.type} not recognized`;
  }
  if (result) {
    if (result.isCorrect) {
      if (result.message) console.log(result.message);
    } else {
      if (result.message) console.error(result.message);
      else console.error(`Something went wrong while processing ${result.ident}`);
    }
  }
};
