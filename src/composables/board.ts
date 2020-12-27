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

  const addStones = (board: Board, position: Position, stones: Stone[]): Board => {
    const updatedBoard = cloneDeep(board);
    updatedBoard[position.y][position.x] = stones;

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

    return addStones(board, position, [stone]);
  };

  const removeStones = (board: Board, position: Position, amount = 1) => {
    if (board[position.y][position.x].length === 0) {
      throw new Error('CANT_REMOVE_EMPTY_FIELD');
    }
    const tempBoard = cloneDeep(board);
    const stones = tempBoard[position.y][position.x] as Stone[];

    const divideIndex = stones.length - amount;
    const removedStones = stones.slice(divideIndex, stones.length);
    tempBoard[position.y][position.x] = stones.slice(0, divideIndex);

    return {
      board: tempBoard,
      removedStones,
    };
  };

  const isAllowedDistance = (from: Position, to: Position) => {
    const distanceX = Math.abs(from.x - to.x);
    const distanceY = Math.abs(from.y - to.y);

    return !(distanceX + distanceY > 1);
  };

  const moveStones = (board: Board, from: Position, to: Position, amount = 1) => {
    if (board[from.y][from.x].length === 0) {
      throw new Error('CANT_MOVE_FROM_EMPTY');
    }
    if (!isAllowedDistance(from, to)) {
      throw new Error('MAX_ONE_STEP');
    }
    const { board: boardWithoutFrom, removedStones } = removeStones(board, from, amount);
    const boardAfterMove = addStones(boardWithoutFrom, to, removedStones);

    return boardAfterMove;
  };

  return {
    createBoard,
    moveStones,
    placeNewStone,
  };
};
