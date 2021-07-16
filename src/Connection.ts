import WebSocket from 'ws';
import ConnectionManager from './ConnectionManager';

// wrapper class for a WebSocket; Will also contain a unique id
export default class Connection {
  private websocket: WebSocket;
  private id: string;
  private manager: ConnectionManager;
  constructor(ws: WebSocket, id: string, manager: ConnectionManager) {
    this.websocket = ws;
    this.id = id;
    this.manager = manager;

    this.setupEvts();
  }

  private setupEvts() {
    // TODO: handle messages
    this.websocket.on('close', () => {
      this.manager.removeConnection(this.id); // NOTE to Bananas, this may be called twice cuz close() evt and stuff so maybe remove the other one if it calls twice
    });
  }

  destroy() {
    this.websocket.close();
    this.manager.removeConnection(this.id);
  }

  get wsocket() {
    return this.websocket;
  }
}
