import Connection from './Connection';
import { getOpponent, PlayerType, Position } from './constants';
import GameManager from './GameManager';
import Player from './Player';

export default class Game {
  p1: Player;
  p2: Player;
  manager: GameManager;
  turn: PlayerType;
  unfreeMoves: Position[];
  // p1: X, p2: O
  constructor(c1: Connection, c2: Connection, manager: GameManager) {
    this.p1 = new Player(c1, 'X');
    this.p2 = new Player(c2, 'O');
    this.manager = manager;
    this.turn = 'X';
    this.unfreeMoves = [];
  }

  move(player: Player, pos: Position) {
    if (player.playerType === this.turn && !this.unfreeMoves.includes(pos)) {
      this.broadcastMove(pos, player.playerType);
      this.unfreeMoves.push(pos);
      this.turn = getOpponent(this.turn); // switch turns
    }
  }

  broadcastMove(pos: Position, type: PlayerType) {
    this.p1.connection.wsocket.send(`CALLMOVE ${type} ${pos}`);
    this.p2.connection.wsocket.send(`CALLMOVE ${type} ${pos}`);
  }

  removeGame() {
    this.manager.removeGame(this);
  }
}
