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
  const isGameDone = ref(false);

  const isFieldEmpty = (board: Board, pos: Position) => board[pos.y][pos.x].length === 0;

  const getTopStone = (
    board: Board, pos: Position,
  ) => board[pos.y]?.[pos.x]?.[board[pos.y][pos.x]?.length - 1];

  const getStoneCount = (board: Board, player: number, type: StoneType) => board
    .flat(2)
    .filter((field) => field.player === player && field.type === type).length;

  const flattenBoard = (board: Board): Board => board
    .map((row, y) => row
      .map((stone, x) => (stone.length > 0 ? [getTopStone(board, { x, y })] : [])));

  const filterOutStanding = (board: Board): Board => board
    .map((row) => row.filter((stone) => stone[0]?.type !== 'STANDING'));

  const isOnEdge = (board: Board, pos: Position): boolean => pos.x === 0
    || pos.y === 0
    || pos.x === board.length - 1
    || pos.y === board.length - 1;

  const isOppositeEdge = (board: Board, from: Position, to: Position): boolean => {
    const size = board.length - 1;
    if (!isOnEdge(board, from) || !isOnEdge(board, to)) {
      return false;
    }
    if (from.x === 0 && from.y === 0) {
      return to.x === size || to.y === size;
    }
    if (from.x === 0) {
      return to.x === size;
    }
    if (from.y === 0) {
      return to.y === size;
    }
    if (from.x === size) {
      return to.x === 0;
    }
    if (from.y === size) {
      return to.y === 0;
    }

    return false;
  };

  const getPlayersNeighborsForPosition = (board: Board, pos: Position): Position[] => {
    const { player } = getTopStone(board, pos);
    const neighbors: Position[] = [];

    if (getTopStone(board, { ...pos, x: pos.x + 1 })?.player === player) {
      neighbors.push({ ...pos, x: pos.x + 1 });
    }
    if (getTopStone(board, { ...pos, x: pos.x - 1 })?.player === player) {
      neighbors.push({ ...pos, x: pos.x - 1 });
    }
    if (getTopStone(board, { ...pos, y: pos.y + 1 })?.player === player) {
      neighbors.push({ ...pos, y: pos.y + 1 });
    }
    if (getTopStone(board, { ...pos, y: pos.y - 1 })?.player === player) {
      neighbors.push({ ...pos, y: pos.y - 1 });
    }

    return neighbors;
  };

  const findStartingField = (board: Board) => {
    for (let y = 0; y < board.length; y += 1) {
      for (let x = 0; x < board.length; x += 1) {
        if (board[y][x].length > 0) {
          return [x, y];
        }
      }
    }
  };

  const hasStreet = (board: Board) => {
    const tooLittleStoneCount = getStoneCount(board, 1, 'FLAT') < DEFAULT_ROWS - 1
      && getStoneCount(board, 2, 'FLAT') < DEFAULT_ROWS - 1;
    if (tooLittleStoneCount) {
      return false;
    }

    const flatBoard = flattenBoard(board);
    const cleanBoard = filterOutStanding(flatBoard);

    const onlyEdgeStones = cleanBoard.map((row, y) => row
      .map((stone, x) => (isOnEdge(board, { x, y }) ? stone : [])));

    const startingPosition = findStartingField(onlyEdgeStones);
    if (!startingPosition) {
      return false;
    }

    const stack = new Set([startingPosition.toString()]);
    const visited = new Set<string>();

    let result;

    visited.add(startingPosition.toString());

    for (let y = 0; y < onlyEdgeStones.length; y += 1) {
      for (let x = 0; x < onlyEdgeStones.length; x += 1) {
        if (onlyEdgeStones[y][x].length === 0) {
          break;
        }

        while (stack.size > 0 && !result) {
          const next = Array.from(stack).pop() as string;
          const [targetX, targetY] = next.split(',').map((i) => parseFloat(i));
          const target = { x: targetX, y: targetY };
          stack.delete(next);

          if (isOppositeEdge(cleanBoard, { x, y }, target)) {
            result = target;
            break;
          }

          getPlayersNeighborsForPosition(cleanBoard, target)
            .map((entry) => `${entry.x},${entry.y}`)
            .filter((entry) => !visited.has(entry))
            .forEach((neighbor) => {
              visited.add(neighbor);
              stack.add(neighbor);
            });
        }
      }
    }

    return result;
  };

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

  const switchPlayer = (player: number) => (player === 1 ? 2 : 1);

  const placeNewStone = (board: Board, pos: Position, type: StoneType): Board => {
    if (!isPositionValid(board, pos)) {
      throw Error('POSITION_OUTSIDE_BOUNDARY');
    }
    if (board[pos.y][pos.x].length > 0) {
      throw Error('FIELD_ALREADY_OCCUPIED');
    }
    if (type === 'CAP' && getStoneCount(board, activePlayer.value, 'CAP') > 0) {
      throw Error('MAX_1_CAP_STONE');
    }

    const newBoard = addStones(board, pos, [{ type, player: activePlayer.value }]);
    activePlayer.value = switchPlayer(activePlayer.value);

    if (hasStreet(newBoard)) {
      isGameDone.value = true;
    }

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
    if (getTopStone(board, from).player !== activePlayer.value) {
      throw new Error('CANNOT_MOVE_OPPONENT_STONE');
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

    if (hasStreet(tempBoard)) {
      isGameDone.value = true;
    }

    return tempBoard;
  };

  return {
    activePlayer,
    isGameDone,
    createBoard,
    moveStones,
    placeNewStone,
    getTopStone,
    getStoneCount,
  };
};
