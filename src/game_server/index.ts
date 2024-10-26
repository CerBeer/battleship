import { WebSocket, WebSocketServer } from 'ws';
import { parseRequest } from './requests/requests';

export function gameServer(gameServerPort: number) {
  const gameServer = new WebSocketServer({
    port: gameServerPort,
    clientTracking: true,
  });

  gameServer.on('connection', (playerSocket: WebSocket) => {
    console.log(`Connected player. Active connections ${gameServer.clients.size}`);

    playerSocket.on('message', (data) => {
      const requestData = data.toString();
      const message = parseRequest(requestData);
      console.log(`Request data: ${message}`);
    });

    playerSocket.on('close', () => {
      console.log(`Disconnected player. Active connections ${gameServer.clients.size}`);
    });
  });

  gameServer.on('listening', () => {
    console.log('\nBattleship is ready to play!');
    console.log('Go to: http://localhost:8181/\n');
  });
}
