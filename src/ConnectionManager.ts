import WebSocket from 'ws';
import Connection from './Connection';

export default class ConnectionManager {
  private connections: Map<string, Connection>;
  constructor() {
    this.connections = new Map();
  }

  /*
   *
   * IMPLICITLY calls removeConnection()
   *
   */
  closeConnection(id: string) {
    this.connections.get(id)?.destroy();
  }

  /*
   *
   * Used ONLY from `Connection`. DO NOT use from any other place
   *
   */
  removeConnection(id: string) {
    this.connections.delete(id);
  }

  createConnection(id: string, ws: WebSocket): Connection {
    const conn = new Connection(ws, id, this);
    this.connections.set(id, conn);
    return conn;
  }
}
