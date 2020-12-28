import { useBoard } from '@/composables/board';

describe('Player Interaction Logic', () => {
  it('switches players after placing a new stone', () => {
    const { createBoard, placeNewStone } = useBoard();
    const emptyBoard = createBoard();

    const newBoard = placeNewStone(emptyBoard, { x: 0, y: 0 }, 'FLAT');
  });
});
