import { Board, Stone, useBoard } from '@/composables/board';

describe('Stone Movement Logic', () => {
  it('moves stone from 0x0 to free 0x1', () => {
    const { createBoard, placeNewStone, moveStones } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    const updatedBoard = placeNewStone(emptyBoard, { x: 0, y: 0 }, newStone);

    const boardAfterMove = moveStones(updatedBoard, { x: 0, y: 0 }, { x: 0, y: 1 });

    const expectedBoard: Board = [
      [[], [], [], [], []],
      [[newStone], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(expectedBoard).toEqual(boardAfterMove);
  });

  it('moves stone from 1x1 to free 1x0', () => {
    const { createBoard, placeNewStone, moveStones } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    const updatedBoard = placeNewStone(emptyBoard, { x: 1, y: 1 }, newStone);

    const boardAfterMove = moveStones(updatedBoard, { x: 1, y: 1 }, { x: 1, y: 0 });

    const expectedBoard: Board = [
      [[], [newStone], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(expectedBoard).toEqual(boardAfterMove);
  });

  it('cannot move more than 1 field', () => {
    const { createBoard, placeNewStone, moveStones } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    const updatedBoard = placeNewStone(emptyBoard, { x: 1, y: 1 }, newStone);

    expect(() => moveStones(updatedBoard, { x: 1, y: 1 }, { x: 2, y: 2 })).toThrow();
    expect(() => moveStones(updatedBoard, { x: 1, y: 1 }, { x: 1, y: 3 })).toThrow();
    expect(() => moveStones(updatedBoard, { x: 1, y: 1 }, { x: 0, y: 1 })).not.toThrow();
    expect(() => moveStones(updatedBoard, { x: 1, y: 1 }, { x: 1, y: 2 })).not.toThrow();
  });

  it('moves top stone from a stack', () => {
    const { createBoard, moveStones } = useBoard();
    const board = createBoard();
    const testStack: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
    ];
    board[0][0] = testStack;

    const boardAfterMove = moveStones(board, { x: 0, y: 0 }, { x: 0, y: 1 });

    const stonesMoved: Stone[] = [
      { player: 1, type: 'FLAT' },
    ];
    const stonesLeft: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
    ];
    const expectedBoard: Board = [
      [stonesLeft, [], [], [], []],
      [stonesMoved, [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(expectedBoard).toEqual(boardAfterMove);
  });

  it('moves a stack correctly', () => {
    const { createBoard, moveStones } = useBoard();
    const board = createBoard();
    const testStack: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
    ];
    board[0][0] = testStack;

    const boardAfterMove = moveStones(board, { x: 0, y: 0 }, { x: 0, y: 1 }, 3);

    const stonesMoved: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
    ];
    const stonesLeft: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
    ];
    const expectedBoard: Board = [
      [stonesLeft, [], [], [], []],
      [stonesMoved, [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(expectedBoard).toEqual(boardAfterMove);
  });

  it('cannot move onto a standing stone as normal stone', () => {
    const { createBoard, moveStones } = useBoard();
    const emptyBoard = createBoard();
    const testField: Stone[] = [
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'STANDING' },
    ];
    const flatStones: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
    ];
    emptyBoard[0][0] = testField;
    emptyBoard[0][1] = flatStones;

    expect(() => moveStones(emptyBoard, { x: 1, y: 0 }, { x: 0, y: 0 })).toThrow();
  });

  it('can flatten as cap stone', () => {
    const { createBoard, moveStones } = useBoard();
    const emptyBoard = createBoard();
    const testField: Stone[] = [
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'STANDING' },
    ];
    const capStoneFile: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'CAP' },
    ];
    emptyBoard[0][0] = testField;
    emptyBoard[0][1] = capStoneFile;

    const newBoard = moveStones(emptyBoard, { x: 1, y: 0 }, { x: 0, y: 0 });

    const expectedTestField: Stone[] = [
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'CAP' },
    ];
    const expectedBoard: Board = [
      [expectedTestField, [{ player: 1, type: 'FLAT' }], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(newBoard).toEqual(expectedBoard);
  });
});
