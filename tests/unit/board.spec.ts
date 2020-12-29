import { useBoard } from '@/composables/board';

describe('Board Creation Logic', () => {
  it('creates a valid default board', () => {
    const { createBoard } = useBoard();

    const board = createBoard();

    const expectedDefaultBoard = [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ];
    expect(board).toEqual(expectedDefaultBoard);
  });

  it('creates a valid 3x3 board', () => {
    const { createBoard } = useBoard();

    const board = createBoard(3, 3);

    const expectedBoard = [
      [[], [], []],
      [[], [], []],
      [[], [], []],
    ];
    expect(board).toEqual(expectedBoard);
  });

  it('creates a valid 4x4 board', () => {
    const { createBoard } = useBoard();

    const board = createBoard(4, 4);

    const expectedBoard = [
      [[], [], [], []],
      [[], [], [], []],
      [[], [], [], []],
      [[], [], [], []],
    ];
    expect(board).toEqual(expectedBoard);
  });

  it('ends the game once player 1 has a street', () => {
    const { createBoard } = useBoard();
    const board = createBoard();

    // TODO
  });
});
