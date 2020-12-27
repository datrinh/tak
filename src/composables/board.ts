type StoneType = 'STANDING' | 'FLAT' | 'CAP'

export interface Stone {
  player: number;
  type: StoneType;
}

export type Board = (Stone|undefined)[][]

interface Position {
  x: number;
  y: number;
}

const ROW_COUNT = 5;
const COL_COUNT = 5;
const EMPTY_FIELD = undefined;

export const useBoard = () => {
  const createBoard = (rowCount = ROW_COUNT, colCount = COL_COUNT): Board => {
    const newBoard = [];
    for (let x = 0; x < rowCount; x += 1) {
      newBoard.push(new Array(colCount).fill(EMPTY_FIELD));
    }
    return newBoard;
  };

  const placeStone = (board: Board, position: Position, stone: Stone): Board => {
    if (board[position.y][position.x]) {
      throw Error('FIELD_ALREADY_OCCUPIED');
    }

    const updatedBoard = board;
    updatedBoard[position.y][position.x] = stone;

    return updatedBoard;
  };

  return {
    createBoard,
    placeStone,
  };
};
