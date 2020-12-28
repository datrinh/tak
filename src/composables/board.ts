import { cloneDeep } from 'lodash';
import { ref } from 'vue';

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

const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 5;
const EMPTY_FIELD: Stone[] = [];

export const useBoard = () => {
  const activePlayer = ref(1);

  const createBoard = (rowCount = DEFAULT_ROWS, colCount = DEFAULT_COLS): Board => {
    const newBoard = [];
    for (let x = 0; x < rowCount; x += 1) {
      newBoard.push(new Array(colCount).fill(EMPTY_FIELD));
    }
    return newBoard;
  };

  const addStones = (board: Board, pos: Position, stones: Stone[]): Board => {
    const updatedBoard = cloneDeep(board);
    updatedBoard[pos.y][pos.x] = [
      ...updatedBoard[pos.y][pos.x],
      ...stones,
    ];
    return updatedBoard;
  };

  const isPositionValid = (board: Board, pos: Position) => {
    const isInsideBoundaries = pos.y <= board.length && pos.x <= board.length;
    const isPositionPositive = pos.y >= 0 && pos.x >= 0;
    return isInsideBoundaries && isPositionPositive;
  };

  const isFieldEmpty = (board: Board, pos: Position) => board[pos.y][pos.x].length === 0;

  const getTopStone = (
    board: Board, pos: Position,
  ) => board[pos.y][pos.x][board[pos.y][pos.x].length - 1];

  const switchPlayer = (player: number) => (player === 1 ? 2 : 1);

  const placeNewStone = (board: Board, pos: Position, type: StoneType): Board => {
    if (!isPositionValid(board, pos)) {
      throw Error('POSITION_OUTSIDE_BOUNDARY');
    }
    if (board[pos.y][pos.x].length > 0) {
      throw Error('FIELD_ALREADY_OCCUPIED');
    }

    const newBoard = addStones(board, pos, [{ type, player: activePlayer.value }]);
    activePlayer.value = switchPlayer(activePlayer.value);

    return newBoard;
  };

  const removeStones = (board: Board, pos: Position, amount = 1) => {
    if (isFieldEmpty(board, pos)) {
      throw new Error('CANT_REMOVE_EMPTY_FIELD');
    }
    const tempBoard = cloneDeep(board);
    const stones = tempBoard[pos.y][pos.x] as Stone[];

    const divideIndex = stones.length - amount;
    const removedStones = stones.slice(divideIndex, stones.length);
    tempBoard[pos.y][pos.x] = stones.slice(0, divideIndex);

    return {
      board: tempBoard,
      removedStones,
    };
  };

  const isAllowedByDistance = (from: Position, to: Position) => {
    const distanceX = Math.abs(from.x - to.x);
    const distanceY = Math.abs(from.y - to.y);

    return !(distanceX + distanceY > 1);
  };

  const isAllowedByType = (board: Board, from: Position, to: Position, amount: number) => {
    if (isFieldEmpty(board, to)) {
      return true;
    }
    const toType = getTopStone(board, to).type;
    if (toType === 'FLAT') {
      return true;
    }
    if (toType === 'CAP') {
      return false;
    }
    if (toType === 'STANDING') {
      return getTopStone(board, from).type === 'CAP' && amount === 1;
    }
    return false;
  };

  const flattenStone = (board: Board, pos: Position) => {
    const tempBoard = cloneDeep(board);
    const topStone = getTopStone(tempBoard, pos);
    topStone.type = 'FLAT';

    return tempBoard;
  };

  const isFlattenMove = (
    board: Board, from: Position, to: Position, amount: number,
  ) => getTopStone(board, to)?.type === 'STANDING'
    && getTopStone(board, from).type === 'CAP'
    && amount === 1;

  const moveStones = (board: Board, from: Position, to: Position, amount = 1) => {
    if (isFieldEmpty(board, from)) {
      throw new Error('CANT_MOVE_FROM_EMPTY');
    }
    if (!isAllowedByDistance(from, to)) {
      throw new Error('MAX_ONE_STEP');
    }
    if (!isAllowedByType(board, from, to, amount)) {
      throw new Error('CANNOT_FLATTEN');
    }
    let tempBoard = cloneDeep(board);
    if (isFlattenMove(tempBoard, from, to, amount)) {
      tempBoard = flattenStone(tempBoard, to);
    }
    const { board: boardWithoutFrom, removedStones } = removeStones(tempBoard, from, amount);
    tempBoard = boardWithoutFrom;

    tempBoard = addStones(tempBoard, to, removedStones);

    activePlayer.value = switchPlayer(activePlayer.value);

    return tempBoard;
  };

  return {
    activePlayer,
    createBoard,
    moveStones,
    placeNewStone,
  };
};
