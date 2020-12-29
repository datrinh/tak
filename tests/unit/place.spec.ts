import { Board, Stone, useBoard } from '@/composables/board';

describe('Stone Placement Logic', () => {
  it('can place a cap stone on 0x0', () => {
    const { createBoard, placeNewStone } = useBoard();
    let board = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };

    board = placeNewStone(board, { x: 0, y: 0 }, newStone.type);

    const expectedBoard: Board = [
      [[newStone], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(board).toEqual(expectedBoard);
  });

  it('can place a standing stone on 1x2', () => {
    const { createBoard, placeNewStone } = useBoard();
    let board = createBoard();
    const newStone: Stone = { player: 1, type: 'STANDING' };

    board = placeNewStone(board, { x: 1, y: 2 }, newStone.type);

    const expectedBoard: Board = [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [newStone], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(board).toEqual(expectedBoard);
  });

  it('can place a flat stone on 4x2', () => {
    const { createBoard, placeNewStone } = useBoard();
    let board = createBoard();
    const newStone: Stone = { player: 1, type: 'FLAT' };

    board = placeNewStone(board, { x: 4, y: 2 }, newStone.type);

    const expectedBoard: Board = [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], [newStone]],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(board).toEqual(expectedBoard);
  });

  it('cannot field a stone on a occupied field', () => {
    const { createBoard, placeNewStone } = useBoard();
    let board = createBoard();
    const firstStone: Stone = { player: 1, type: 'FLAT' };
    const secondStone: Stone = { player: 2, type: 'FLAT' };

    board = placeNewStone(board, { x: 1, y: 1 }, firstStone.type);

    expect(() => placeNewStone(board, { x: 1, y: 1 }, secondStone.type)).toThrow();
  });

  it('only allows placing within its boundaries', () => {
    const { createBoard, placeNewStone } = useBoard();
    const board = createBoard();
    const newStone: Stone = { player: 1, type: 'FLAT' };

    expect(() => placeNewStone(board, { x: -1, y: 0 }, newStone.type)).toThrow();
    expect(() => placeNewStone(board, { x: 0, y: -1 }, newStone.type)).toThrow();
    expect(() => placeNewStone(board, { x: 6, y: 2 }, newStone.type)).toThrow();
  });

  it('switches players after placing a new stone', () => {
    const {
      createBoard, placeNewStone, getTopStone, activePlayer,
    } = useBoard();
    let board = createBoard();
    expect(activePlayer.value).toBe(1);

    board = placeNewStone(board, { x: 0, y: 0 }, 'FLAT');
    expect(getTopStone(board, { x: 0, y: 0 }).player).toBe(1);
    expect(activePlayer.value).toBe(2);

    board = placeNewStone(board, { x: 1, y: 0 }, 'FLAT');
    expect(getTopStone(board, { x: 1, y: 0 }).player).toBe(2);
    expect(activePlayer.value).toBe(1);

    board = placeNewStone(board, { x: 2, y: 0 }, 'FLAT');
    expect(getTopStone(board, { x: 2, y: 0 }).player).toBe(1);
    expect(activePlayer.value).toBe(2);
  });

  it('cannot place more than 1 cap stone for 1 player', () => {
    const { createBoard, placeNewStone } = useBoard();
    let board = createBoard();

    board = placeNewStone(board, { x: 0, y: 0 }, 'CAP');
    board = placeNewStone(board, { x: 4, y: 4 }, 'CAP');

    expect(() => placeNewStone(board, { x: 1, y: 0 }, 'CAP')).toThrow();
  });
});
