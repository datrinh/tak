import { Board, Stone, useBoard } from '@/composables/board';

describe('Stone Movement Logic', () => {
  it('moves stone from 0x0 to free 0x1', () => {
    const { createBoard, placeNewStone, moveStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    const updatedBoard = placeNewStone(emptyBoard, { x: 0, y: 0 }, newStone);

    const boardAfterMove = moveStone(updatedBoard, { x: 0, y: 0 }, { x: 0, y: 1 });

    const expectedBoard: Board = [
      [undefined, undefined, undefined, undefined, undefined],
      [[newStone], undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
    ];
    expect(expectedBoard).toEqual(boardAfterMove);
  });

  it('moves stone from 1x1 to free 1x0', () => {
    const { createBoard, placeNewStone, moveStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    const updatedBoard = placeNewStone(emptyBoard, { x: 1, y: 1 }, newStone);

    const boardAfterMove = moveStone(updatedBoard, { x: 1, y: 1 }, { x: 1, y: 0 });

    const expectedBoard: Board = [
      [undefined, [newStone], undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
    ];
    expect(expectedBoard).toEqual(boardAfterMove);
  });

  it('cannot move more than 1 field', () => {
    const { createBoard, placeNewStone, moveStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };
    const updatedBoard = placeNewStone(emptyBoard, { x: 1, y: 1 }, newStone);

    expect(() => moveStone(updatedBoard, { x: 1, y: 1 }, { x: 2, y: 2 })).toThrow();
    expect(() => moveStone(updatedBoard, { x: 1, y: 1 }, { x: 1, y: 3 })).toThrow();
    expect(() => moveStone(updatedBoard, { x: 1, y: 1 }, { x: 0, y: 1 })).not.toThrow();
    expect(() => moveStone(updatedBoard, { x: 1, y: 1 }, { x: 1, y: 2 })).not.toThrow();
  });
});
