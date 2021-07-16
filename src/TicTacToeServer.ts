import { Server } from 'ws';
import ConnectionManager from './ConnectionManager';
import GameManager from './GameManager';
import Queue from './Queue';
import Utils from './utils';

export default class TicTacToeServer {
  server: Server;
  connections: ConnectionManager;
  queue: Queue;
  games: GameManager;
  constructor(port: number) {
    this.server = new Server({ port });
    this.connections = new ConnectionManager();
    this.queue = new Queue(this);
    this.games = new GameManager();

    this.setupEvents();

    console.log(`Websocket Server listening on port: ${port}`);
  }

  private setupEvents() {
    this.server.on('connection', (ws) => {
      // create a unique id for the connection
      const uId = Utils.generate16Key();
      ws.send(`SETID ${uId}`);

      // register the connection
      const conn = this.connections.createConnection(uId, ws);

      // add to queue
      this.queue.addToQueue(conn);
    });
  }
}
