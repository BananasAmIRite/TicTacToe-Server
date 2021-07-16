import Connection from './Connection';
import { PlayerType } from './constants';

export default class Player {
  private conn: Connection;
  private player: PlayerType;
  constructor(conn: Connection, playerType: PlayerType) {
    this.conn = conn;
    this.playerType = playerType;
  }

  get connection() {
    return this.conn;
  }

  set playerType(plr: PlayerType) {
    this.player = plr;
    this.conn.wsocket.send(`SETPLAYER ${plr}`);
  }

  get playerType() {
    return this.player;
  }
}
