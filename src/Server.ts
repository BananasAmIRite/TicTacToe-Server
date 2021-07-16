import WebSocket, { Server as WebSocketServer } from 'ws';
import ConnectionManager from './ConnectionManager';
import GameManager from './GameManager';
import Queue from './Queue';
import Utils from './utils';

export default class Server {
  server: WebSocketServer;
  connections: ConnectionManager;
  queue: Queue;
  games: GameManager;
  constructor(port: number) {
    this.server = new WebSocketServer({ port });
    this.connections = new ConnectionManager();
    this.queue = new Queue(this);
    this.games = new GameManager();

    this.setupEvents();
  }

  private setupEvents() {
    this.server.on('connection', (ws) => {
      // create a unique id for the connection
      const uId = Utils.generate16Key();
      ws.send(`SETID ${uId}`);

      // register the connection
      this.connections.createConnection(uId, ws);
    });
  }
}
