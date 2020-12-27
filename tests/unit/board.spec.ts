import { useBoard } from '@/composables/board';

describe('Board Logic', () => {
  it('creates a valid default board', () => {
    const { createBoard } = useBoard();
    const emptyBoard = createBoard();

    const expectedDefaultBoard = [
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined],
    ];

    expect(emptyBoard).toEqual(expectedDefaultBoard);
  });

  it('creates a valid 3x3 board', () => {
    const { createBoard } = useBoard();
    const emptyBoard = createBoard(3, 3);

    const expectedBoard = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ];

    expect(emptyBoard).toEqual(expectedBoard);
  });

  it('creates a valid 4x4 board', () => {
    const { createBoard } = useBoard();
    const emptyBoard = createBoard(4, 4);

    const expectedBoard = [
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];

    expect(emptyBoard).toEqual(expectedBoard);
  });
});
