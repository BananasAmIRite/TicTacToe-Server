import WebSocket from 'ws';
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
    // TODO: implement player leave and move events
    this.p1 = new Player(c1, 'X');
    this.p2 = new Player(c2, 'O');
    this.manager = manager;
    this.turn = 'X';
    this.unfreeMoves = [];

    this.setupPlayers();
  }

  private setupPlayers() {
    this.p1.connection.wsocket.on('close', () => {
      this.win(this.p2);
    });
    this.p2.connection.wsocket.on('close', () => {
      this.win(this.p1);
    });

    this.p1.connection.wsocket.on('message', (data) => {
      this.handleMessage(data, this.p1);
    });

    this.p2.connection.wsocket.on('message', (data) => {
      this.handleMessage(data, this.p2);
    });

    this.p1.connection.wsocket.send(`STARTGAME`);
    this.p2.connection.wsocket.send(`STARTGAME`);
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

  // you probably shouldn't call this when no one has won yet
  win(player: Player) {
    this.removeGame(player.playerType);
  }

  removeGame(winner: PlayerType) {
    this.endGame(winner);
    this.manager.removeGame(this);
  }

  handleMessage(data: WebSocket.Data, p: Player) {
    const str = data.toString();

    const args = str.split(' ');

    if (args[0] === 'MOVE') {
      const movePos = args[1];
      if (movePos && isValidPosition(movePos)) this.move(p, movePos);
    }
  }

  // sends an end game event to both players with the winner
  private endGame(winner: PlayerType) {
    this.p1.connection.wsocket.send(`ENDGAME ${winner}`);
    this.p2.connection.wsocket.send(`ENDGAME ${winner}`);
  }
}

const isValidPosition = function (str: string): str is Position {
  return /^(a|b|c)(1|2|3)$/.test(str);
};
