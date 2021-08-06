import WebSocket from 'ws';
import Connection from './Connection';
import { BoardState, getOpponent, PlayerType, Position, WinState } from './constants';
import GameManager from './GameManager';
import Player from './Player';

export default class Game {
  p1: Player;
  p2: Player;
  manager: GameManager;
  turn: PlayerType;
  unfreeMoves: Position[];
  board: BoardState[][];
  sizeX: number = 3;
  sizeY: number = 3;
  static WIN_POSITIONS: Position[][] = [
    // row wins
    ['11', '12', '13'],
    ['21', '22', '23'],
    ['31', '32', '33'],
    // column wins
    ['11', '21', '31'],
    ['12', '22', '32'],
    ['13', '23', '33'],
    // cross wins
    ['11', '22', '33'],
    ['13', '22', '31'],
  ];
  // p1: X, p2: O
  constructor(c1: Connection, c2: Connection, manager: GameManager) {
    // this is the actual game
    // TODO: implement player leave and move events

    c1.wsocket.send(`STARTGAME`);
    c2.wsocket.send(`STARTGAME`);

    this.p1 = new Player(c1, 'X');
    this.p2 = new Player(c2, 'O');
    this.manager = manager;
    this.turn = 'X';
    this.unfreeMoves = [];
    this.board = [];

    this.setupBoard();
    this.setupPlayers();
  }

  private setupPlayers() {
    this.p1.connection.wsocket.on('close', () => {
      this.winByPlayer(this.p2);
    });
    this.p2.connection.wsocket.on('close', () => {
      this.winByPlayer(this.p1);
    });

    this.p1.connection.wsocket.on('message', (data) => {
      this.handleMessage(data, this.p1);
    });

    this.p2.connection.wsocket.on('message', (data) => {
      this.handleMessage(data, this.p2);
    });
  }

  private setupBoard() {
    for (let i = 0; i < this.sizeY; i++) {
      const row: BoardState[] = [];
      for (let j = 0; j < this.sizeX; j++) {
        row.push('');
      }
      this.board.push(row);
    }
  }

  move(player: Player, pos: Position) {
    if (player.playerType === this.turn && !this.unfreeMoves.includes(pos)) {
      this.broadcastMove(pos, player.playerType); // broadcast move to all players :D
      this.unfreeMoves.push(pos); // add that to the unfree moves so you wont be able to use it again
      this.updateBoard(pos, player.playerType); // update the virtual board
      this.checkWinOrTie(); // checks for win or tie
      this.turn = getOpponent(this.turn); // switch turns
    }
  }

  broadcastMove(pos: Position, type: PlayerType) {
    this.p1.connection.wsocket.send(`CALLMOVE ${type} ${pos}`);
    this.p2.connection.wsocket.send(`CALLMOVE ${type} ${pos}`);
  }

  // more suitable alias :D
  // you probably shouldn't call this when no one has won yet
  winByPlayer(player: Player) {
    this.winByType(player.playerType);
  }

  // more suitable alias :D
  winByType(type: PlayerType) {
    this.removeGame(type);
  }

  tie() {
    this.removeGame('TIE');
  }

  removeGame(winState: WinState) {
    this.endGame(winState);
    this.closeBothConnections();
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

  private closeBothConnections() {
    this.p1.connection.wsocket.close();
    this.p2.connection.wsocket.close();
  }

  // sends an end game event to both players with the winner
  private endGame(winState: WinState) {
    this.p1.connection.wsocket.send(`ENDGAME ${winState}`);
    this.p2.connection.wsocket.send(`ENDGAME ${winState}`);
  }

  // parses the position and updates the board
  private updateBoard(pos: Position, state: BoardState) {
    const colBit = parseInt(pos[0]) - 1;
    const rowBit = parseInt(pos[1]) - 1;
    // interesting note: apparently, arr["0"], ["1"], ["2"], etc. works??
    this.board[colBit][rowBit] = state;
  }

  private checkWinOrTie(): boolean {
    for (const winPos of Game.WIN_POSITIONS) {
      let brdState: BoardState;
      let won = true;
      for (const pos of winPos) {
        if (!brdState && brdState != '') brdState = this.getPositionAt(pos);

        if (brdState !== this.getPositionAt(pos)) {
          won = false;
          break;
        }
      }
      if (brdState && won) {
        // if won and board state isn't "" or undefined
        this.winByType(brdState);
        return true;
      }
    }

    if (this.unfreeMoves.length >= this.sizeX * this.sizeY) {
      this.tie();
      return true;
    }
    return false;
  }

  /*
    sadly doesn't work for assignments since its not a ref :(
  */
  private getPositionAt(pos: Position): BoardState | undefined {
    try {
      return this.board[parseInt(pos[0]) - 1][parseInt(pos[1]) - 1];
    } catch (err) {
      return;
    }
  }
}

const isValidPosition = function (str: string): str is Position {
  return /^(1|2|3)(1|2|3)$/.test(str);
};
