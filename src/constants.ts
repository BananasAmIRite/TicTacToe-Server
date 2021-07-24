export type PlayerType = 'X' | 'O';

export function getOpponent(type: PlayerType): PlayerType {
  return type === 'X' ? 'O' : 'X';
}

export type row = '1' | '2' | '3';
export type col = '1' | '2' | '3';

export type Position = `${col}${row}`;
// 12
// 1st digit is the col
// 2nd digit is the row

export type BoardState = PlayerType | '';

export type WinState = PlayerType | 'TIE';
