import { Board, Stone, useBoard } from '@/composables/board';

describe('Stone Placement Logic', () => {
  it('can place a cap stone on 0x0', () => {
    const { createBoard, placeStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'CAP' };

    const updatedBoard = placeStone(emptyBoard, { x: 0, y: 0 }, newStone);

    const expectedBoard: Board = [
      [{ player: 1, type: 'CAP' }, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
    ];
    expect(expectedBoard).toEqual(updatedBoard);
  });

  it('can place a standing stone on 1x2', () => {
    const { createBoard, placeStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'STANDING' };

    const updatedBoard = placeStone(emptyBoard, { x: 1, y: 2 }, newStone);

    const expectedBoard: Board = [
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, { player: 1, type: 'STANDING' }, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
    ];
    expect(expectedBoard).toEqual(updatedBoard);
  });

  it('can place a flat stone on 4x2', () => {
    const { createBoard, placeStone } = useBoard();
    const emptyBoard = createBoard();
    const newStone: Stone = { player: 1, type: 'FLAT' };

    const updatedBoard = placeStone(emptyBoard, { x: 4, y: 2 }, newStone);

    const expectedBoard: Board = [
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, { player: 1, type: 'FLAT' }],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
    ];
    expect(expectedBoard).toEqual(updatedBoard);
  });

  it('cannot field a stone on a occupied field', () => {
    const { createBoard, placeStone } = useBoard();
    const emptyBoard = createBoard();
    const firstStone: Stone = { player: 1, type: 'FLAT' };
    const secondStone: Stone = { player: 2, type: 'FLAT' };

    const firstBoard = placeStone(emptyBoard, { x: 1, y: 1 }, firstStone);

    expect(() => placeStone(firstBoard, { x: 1, y: 1 }, secondStone)).toThrow();
  });
});
