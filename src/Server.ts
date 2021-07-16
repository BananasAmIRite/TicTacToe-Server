import WebSocket, { Server as WebSocketServer } from 'ws';
import ConnectionManager from './ConnectionManager';
import Utils from './utils';

export default class Server {
  server: WebSocketServer;
  connections: ConnectionManager;
  constructor(port: number) {
    this.server = new WebSocketServer({ port });
    this.connections = new ConnectionManager();

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
