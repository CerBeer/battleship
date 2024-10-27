import { PlayerMessage } from 'game_server/database/users';

export type DataReg = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

export const reg = (playerMessage: PlayerMessage) => {
  const result = JSON.stringify({
    name: playerMessage.user.name,
    index: playerMessage.user.index,
    error: !playerMessage.isCorrect,
    errorText: !playerMessage.isCorrect ? playerMessage.message : '',
  });
  return result;
};
