import { httpServer } from './src/http_server/index.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log('\nBattleship is ready to play!');
console.log('Go to: http://localhost:8181/\n');
