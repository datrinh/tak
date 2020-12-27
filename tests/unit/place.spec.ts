import { Board, Stone, useBoard } from '@/composables/board';

describe('Stone Placement Logic', () => {
  it('can place a cap stone on 0x0', () => {
    const { createBoard, placeNewStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };

    const updatedBoard = placeNewStone(emptyBoard, { x: 0, y: 0 }, newStone);

    const expectedBoard: Board = [
      [[newStone], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(expectedBoard).toEqual(updatedBoard);
  });

  it('can place a standing stone on 1x2', () => {
    const { createBoard, placeNewStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'STANDING' };

    const updatedBoard = placeNewStone(emptyBoard, { x: 1, y: 2 }, newStone);

    const expectedBoard: Board = [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [newStone], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(expectedBoard).toEqual(updatedBoard);
  });

  it('can place a flat stone on 4x2', () => {
    const { createBoard, placeNewStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'FLAT' };

    const updatedBoard = placeNewStone(emptyBoard, { x: 4, y: 2 }, newStone);

    const expectedBoard: Board = [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], [newStone]],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(expectedBoard).toEqual(updatedBoard);
  });

  it('cannot field a stone on a occupied field', () => {
    const { createBoard, placeNewStone } = useBoard();
    const emptyBoard = createBoard();
    const firstStone: Stone = { player: 1, type: 'FLAT' };
    const secondStone: Stone = { player: 2, type: 'FLAT' };

    const firstBoard = placeNewStone(emptyBoard, { x: 1, y: 1 }, firstStone);

    expect(() => placeNewStone(firstBoard, { x: 1, y: 1 }, secondStone)).toThrow();
  });

  it('only allows placing within its boundaries', () => {
    const { createBoard, placeNewStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'FLAT' };

    expect(() => placeNewStone(emptyBoard, { x: -1, y: 0 }, newStone)).toThrow();
    expect(() => placeNewStone(emptyBoard, { x: 0, y: -1 }, newStone)).toThrow();
    expect(() => placeNewStone(emptyBoard, { x: 6, y: 2 }, newStone)).toThrow();
  });
});
