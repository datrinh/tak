import { Board, Stone, useBoard } from '@/composables/board';

describe('Stone Movement Logic', () => {
  it('moves stone from 0x0 to free 0x1', () => {
    const { createBoard, moveStones } = useBoard();
    let board = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    board[0][0] = [newStone];

    board = moveStones(board, { x: 0, y: 0 }, { x: 0, y: 1 });

    const expectedBoard: Board = [
      [[], [], [], [], []],
      [[newStone], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(board).toEqual(expectedBoard);
  });

  it('moves stone from 1x1 to free 1x0', () => {
    const { createBoard, moveStones } = useBoard();
    let board = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    board[1][1] = [newStone];

    board = moveStones(board, { x: 1, y: 1 }, { x: 1, y: 0 });

    const expectedBoard: Board = [
      [[], [newStone], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(board).toEqual(expectedBoard);
  });

  it('cannot move more than 1 field', () => {
    const { createBoard, placeNewStone, moveStones } = useBoard();
    let board = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    board = placeNewStone(board, { x: 1, y: 1 }, newStone.type);

    expect(() => moveStones(board, { x: 1, y: 1 }, { x: 2, y: 2 })).toThrow();
    expect(() => moveStones(board, { x: 1, y: 1 }, { x: 1, y: 3 })).toThrow();
  });

  it('moves top stone from a stack', () => {
    const { createBoard, moveStones } = useBoard();
    let board = createBoard();
    const testStack: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
    ];
    board[0][0] = testStack;

    board = moveStones(board, { x: 0, y: 0 }, { x: 0, y: 1 });

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
    expect(board).toEqual(expectedBoard);
  });

  it('moves a stack correctly', () => {
    const { createBoard, moveStones } = useBoard();
    let board = createBoard();
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

    board = moveStones(board, { x: 0, y: 0 }, { x: 0, y: 1 }, 3);

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
    expect(board).toEqual(expectedBoard);
  });

  it('cannot move onto a standing stone as normal stone', () => {
    const {
      createBoard, moveStones,
    } = useBoard();
    const board = createBoard();
    const testField: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'STANDING' },
    ];
    const flatStones: Stone[] = [
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
    ];
    board[0][0] = testField;
    board[0][1] = flatStones;

    expect(() => moveStones(board, { x: 1, y: 0 }, { x: 0, y: 0 })).toThrow();
  });

  it('can flatten as cap stone', () => {
    const { createBoard, moveStones } = useBoard();
    const board = createBoard();
    const testField: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'STANDING' },
    ];
    const capStoneField: Stone[] = [
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'CAP' },
    ];
    board[0][0] = testField;
    board[0][1] = capStoneField;

    const newBoard = moveStones(board, { x: 1, y: 0 }, { x: 0, y: 0 });

    const expectedTestField: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'CAP' },
    ];
    const expectedBoard: Board = [
      [expectedTestField, [{ player: 2, type: 'FLAT' }], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(newBoard).toEqual(expectedBoard);
  });

  it('cannot flatten with cap when moving stack', () => {
    const { createBoard, moveStones } = useBoard();
    const board = createBoard();
    const testField: Stone[] = [
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'STANDING' },
    ];
    const capStoneField: Stone[] = [
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'FLAT' },
      { player: 1, type: 'FLAT' },
      { player: 2, type: 'CAP' },
    ];
    board[0][0] = testField;
    board[0][1] = capStoneField;

    expect(() => moveStones(board, { x: 1, y: 0 }, { x: 0, y: 0 }, 3)).toThrow();
  });

  it('switches players after moving stones', () => {
    const {
      createBoard, moveStones, placeNewStone, activePlayer,
    } = useBoard();
    let board = createBoard();
    board = placeNewStone(board, { x: 0, y: 0 }, 'FLAT');
    board = placeNewStone(board, { x: 1, y: 0 }, 'FLAT');
    expect(activePlayer.value).toBe(1);

    board = moveStones(board, { x: 0, y: 0 }, { x: 0, y: 1 });
    expect(activePlayer.value).toBe(2);

    board = moveStones(board, { x: 1, y: 0 }, { x: 1, y: 1 });
    expect(activePlayer.value).toBe(1);
  });

  it('can only move stacks that belong to player', () => {
    const {
      createBoard, moveStones, placeNewStone, activePlayer,
    } = useBoard();
    let board = createBoard();
    board = placeNewStone(board, { x: 0, y: 0 }, 'FLAT');
    board = placeNewStone(board, { x: 1, y: 0 }, 'FLAT');
    expect(activePlayer.value).toBe(1);

    expect(() => moveStones(board, { x: 1, y: 0 }, { x: 1, y: 1 })).toThrow();
  });
});
