export const RequestTypes = {
  empty: 'empty',
  reg: 'reg',
  create_room: 'create_room',
  add_user_to_room: 'add_user_to_room',
  add_ships: 'add_ships',
  attack: 'attack',
  randomAttack: 'randomAttack',
};

export type Request = {
  isCorrect: boolean;
  type: keyof typeof RequestTypes;
  data: object;
  id: number;
};

export const emptyRequest = {
  isCorrect: true,
  type: RequestTypes.empty,
  data: {},
  id: 0,
};

export const parseRequest = (requestData: string) => {
  const result = emptyRequest;

  try {
    const message = JSON.parse(requestData);
    const { type, data, id } = message;
    if (RequestTypes.hasOwnProperty(type) && data && id) {
      result.type = type;
      result.data = data;
      result.id = id;
    } else {
      result.isCorrect = false;
    }
  } catch {
    result.isCorrect = false;
  }

  return result;
};
