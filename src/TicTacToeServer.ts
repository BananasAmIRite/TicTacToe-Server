import { Server } from 'ws';
import ConnectionManager from './ConnectionManager';
import GameManager from './GameManager';
import Queue from './Queue';
import Utils from './utils';

export default class TicTacToeServer {
  server: Server;
  connections: ConnectionManager; // a map of connections and their unique ids
  queue: Queue; // manager for a queue for the game. creates a new game when 2 players have joined
  games: GameManager; // manager for all the games
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
      // ws.close();
      // ws.send('e');

      // create a unique id for the connection
      const uId = Utils.generateID(); // with this ID generation method, there IS the problem of asynchronous access, so I'm gonna make this event synchronous for now until I find a better method

      console.log('connection nice');

      // ws.send(`SETID ${uId}`);
      ws.send('test message');

      ws.on('message', (msg) => {
        console.log(msg.toString());
      });
      // ws.on('close', (code, reason) => {
      //   console.log(`socket closed: ${code}`);
      //   console.log(`reason: ${reason}`);
      // });

      // register the connection
      const conn = this.connections.createConnection(uId, ws);

      // add to queue
      this.queue.addToQueue(conn);
    });
  }
}
