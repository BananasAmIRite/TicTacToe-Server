import Connection from './Connection';
import Game from './Game';

export default class GameManager {
  private games: Game[];
  constructor() {
    this.games = [];
  }

  create(c1: Connection, c2: Connection): Game {
    const game = new Game(c1, c2, this);
    this.games.push(game);

    return game;
  }

  removeGame(game: Game): boolean {
    const i = this.games.indexOf(game);
    if (i != -1) {
      this.games.splice(i, 1);
      return true;
    }
    return false;
  }
}
