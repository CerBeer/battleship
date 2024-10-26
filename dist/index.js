"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./src/http_server/index.js");
const index_js_2 = require("./src/game_server/index.js");
const HTTP_PORT = 8181;
const WS_PORT = 3000;
(0, index_js_2.gameServer)(WS_PORT);
console.log(`Start game server on the ${WS_PORT} port!`);
index_js_1.httpServer.listen(HTTP_PORT);
console.log(`Start static http server on the ${HTTP_PORT} port!`);
//# sourceMappingURL=index.js.map