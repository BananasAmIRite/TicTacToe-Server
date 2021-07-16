import Connection from './Connection';
import Game from './Game';
import Server from './Server';

export default class Queue {
  server: Server;
  queue: Connection[];
  constructor(server: Server) {
    this.server = server;
    this.queue = [];
  }

  addToQueue(conn: Connection) {
    this.queue.push(conn);
    conn.wsocket.on('close', () => {
      this.remove(conn);
    });

    if (this.queue.length >= 2) {
      const c1 = this.queue.shift();
      const c2 = this.queue.shift();

      if (c1 && c2) this.server.games.create(c1, c2);
    }
  }

  remove(conn: Connection): boolean {
    const i = this.queue.indexOf(conn);
    if (i != -1) {
      this.queue.splice(i, 1);
      return true;
    }
    return false;
  }
}
