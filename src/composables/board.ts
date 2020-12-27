const ROW_COUNT = 5;
const COL_COUNT = 5;

export const useBoard = () => {
  const createBoard = (rowCount = ROW_COUNT, colCount = COL_COUNT) => {
    const newBoard = [];
    for (let x = 0; x < rowCount; x += 1) {
      newBoard.push(new Array(colCount));
    }
    return newBoard;
  };

  return {
    createBoard,
  };
};
