export type PlayerType = 'X' | 'O';

export function getOpponent(type: PlayerType): PlayerType {
  return type === 'X' ? 'O' : 'X';
}

export type row = 'a' | 'b' | 'c';
export type col = '1' | '2' | '3';

export type Position = `${row}${col}`;
