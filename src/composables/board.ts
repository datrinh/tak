import { cloneDeep } from 'lodash';

type StoneType = 'STANDING' | 'FLAT' | 'CAP'

export interface Stone {
  player: number;
  type: StoneType;
}

export type Board = Stone[][][]

interface Position {
  x: number;
  y: number;
}

const ROW_COUNT = 5;
const COL_COUNT = 5;
const EMPTY_FIELD: Stone[] = [];

export const useBoard = () => {
  const createBoard = (rowCount = ROW_COUNT, colCount = COL_COUNT): Board => {
    const newBoard = [];
    for (let x = 0; x < rowCount; x += 1) {
      newBoard.push(new Array(colCount).fill(EMPTY_FIELD));
    }
    return newBoard;
  };

  const addStone = (board: Board, position: Position, stone: Stone): Board => {
    const updatedBoard = cloneDeep(board);
    updatedBoard[position.y][position.x] = [stone];

    return updatedBoard;
  };

  const isPositionValid = (board: Board, position: Position) => {
    const isInsideBoundaries = position.y <= board.length && position.x <= board.length;
    const isPositionPositive = position.y >= 0 && position.x >= 0;
    return isInsideBoundaries && isPositionPositive;
  };

  const placeNewStone = (board: Board, position: Position, stone: Stone): Board => {
    if (!isPositionValid(board, position)) {
      throw Error('POSITION_OUTSIDE_BOUNDARY');
    }
    if (board[position.y][position.x].length > 0) {
      throw Error('FIELD_ALREADY_OCCUPIED');
    }

    return addStone(board, position, stone);
  };

  const removeStone = (board: Board, position: Position, index = 0) => {
    if (!board[position.y][position.x]) {
      throw new Error('CANT_REMOVE_EMPTY_FIELD');
    }
    const tempBoard = cloneDeep(board);
    const [stone] = tempBoard[position.y][position.x] as Stone[];
    tempBoard[position.y][position.x] = [];

    return {
      board: tempBoard,
      stone,
    };
  };

  const isAllowedDistance = (from: Position, to: Position) => {
    const distanceX = Math.abs(from.x - to.x);
    const distanceY = Math.abs(from.y - to.y);

    return !(distanceX + distanceY > 1);
  };

  const moveStone = (board: Board, from: Position, to: Position, index = 0) => {
    if (board[from.y][from.x].length === 0) {
      throw new Error('CANT_MOVE_FROM_EMPTY');
    }
    if (!isAllowedDistance(from, to)) {
      throw new Error('MAX_ONE_STEP');
    }
    const { board: boardWithoutFrom, stone } = removeStone(board, from);
    const boardAfterMove = addStone(boardWithoutFrom, to, stone);

    return boardAfterMove;
  };

  return {
    createBoard,
    moveStone,
    placeNewStone,
  };
};
