import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Board, Card } from './types'; // Импортируем интерфейсы Board и Card

interface BoardState {
  boards: Board[];
}

const initialState: BoardState = {
  boards: [],
};

// Асинхронное действие для получения досок
export const fetchBoards = createAsyncThunk<Board[]>(
  'boards/fetchBoards',
  async () => {
    const response = await fetch('http://localhost:5000/api/boards');
    const data = await response.json();
    return data;
  },
);

export const createBoard = createAsyncThunk<
  Board,
  { name: string; _id: string }
>('boards/createBoard', async ({ name, _id }) => {
  const response = await fetch('http://localhost:5000/api/boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, _id }), // Include _id in the body
  });
  if (!response.ok) {
    throw new Error('Failed to create board');
  }
  return response.json(); // Ensure your server returns the created board data
});

// Async action for deleting a board
export const deleteBoard = createAsyncThunk<string, string>(
  'boards/deleteBoard',
  async (boardId) => {
    const response = await fetch(
      `http://localhost:5000/api/boards/${boardId}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete board');
    }
    return boardId; // Return the ID of the deleted board
  },
);

// Асинхронное действие для добавления карточки
export const addCard = createAsyncThunk<
  Card,
  {
    boardId: string;
    index: string;
    columnNumber: string;
    title: string;
    description: string;
  }
>(
  'boards/addCard',
  async ({ boardId, index, columnNumber, title, description }) => {
    const response = await fetch(
      `http://localhost:5000/api/boards/${columnNumber}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardId, index, title, description }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to add card');
    }
    return response.json();
  },
);

// Асинхронное действие для обновления карточки
export const updateCard = createAsyncThunk<
  Card,
  {
    boardId: string;
    columnNumber: string;
    cardId: string;
    title: string;
    description: string;
  }
>(
  'boards/updateCard',
  async ({ boardId, columnNumber, cardId, title, description }) => {
    const response = await fetch(
      `http://localhost:5000/api/boards/${columnNumber}/${cardId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardId, title, description }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to update card');
    }
    return response.json();
  },
);

// Асинхронное действие для удаления карточки
export const deleteCard = createAsyncThunk<
  string,
  { boardId: string; columnNumber: string; cardId: string }
>('boards/deleteCard', async ({ boardId, columnNumber, cardId }) => {
  const response = await fetch(
    `http://localhost:5000/api/boards/${boardId}/${columnNumber}/${cardId}`,
    {
      method: 'DELETE',
    },
  );
  if (!response.ok) {
    throw new Error('Failed to delete card');
  }
  return cardId; // Возвращаем ID удаленной карточки
});

export const moveCard = createAsyncThunk<
  Card,
  {
    boardId: string;
    fromColumn: string;
    toColumn: string;
    cardId: string;
    toIndex: string;
  }
>(
  'boards/moveCard',
  async ({ boardId, fromColumn, toColumn, cardId, toIndex }) => {
    const response = await fetch(
      `http://localhost:5000/api/boards/from/${fromColumn}/to/${toColumn}/${cardId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId,
          fromColumn,
          toColumn,
          cardId,
          toIndex,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to move card');
    }
    return response.json(); // Убедитесь, что это возвращает Card
  },
);

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload); // Добавляем новую доску в состояние
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        // Remove the deleted board from the state
        state.boards = state.boards.filter(
          (board) => board._id !== action.payload,
        );
      })
      .addCase(addCard.fulfilled, (state, action) => {
        const { boardId, columnNumber } = action.meta.arg;
        const board = state.boards.find((board) => board._id === boardId);
        if (board) {
          if (columnNumber === '1') {
            board.todo.push(action.payload); // Добавляем в "To Do"
          } else if (columnNumber === '2') {
            board.inProgress.push(action.payload); // Добавляем в "In Progress"
          } else if (columnNumber === '3') {
            board.done.push(action.payload); // Добавляем в "Done"
          }
        }
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const { boardId, columnNumber, cardId } = action.meta.arg;
        const board = state.boards.find((board) => board._id === boardId);
        if (board) {
          let cardList: Card[] = [];
          if (columnNumber === '1') {
            cardList = board.todo;
          } else if (columnNumber === '2') {
            cardList = board.inProgress;
          } else if (columnNumber === '3') {
            cardList = board.done;
          }
          const cardIndex = cardList.findIndex((card) => card._id === cardId);
          if (cardIndex !== -1) {
            cardList[cardIndex] = action.payload; // Обновляем карточку в соответствующей колонке
          }
        }
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        const { boardId, columnNumber } = action.meta.arg;
        const board = state.boards.find((board) => board._id === boardId);
        if (board) {
          if (columnNumber === '1') {
            board.todo = board.todo.filter(
              (card) => card._id !== action.payload,
            );
          } else if (columnNumber === '2') {
            board.inProgress = board.inProgress.filter(
              (card) => card._id !== action.payload,
            );
          } else if (columnNumber === '3') {
            board.done = board.done.filter(
              (card) => card._id !== action.payload,
            );
          }
        }
      })
      .addCase(moveCard.fulfilled, (state, action) => {
        const { boardId, fromColumn, toColumn, toIndex } = action.meta.arg;
        const board = state.boards.find((board) => board._id === boardId);

        if (board) {
          const movedCard = action.payload; // Предполагаем, что API возвращает перемещённую карточку

          // Удаляем карточку из исходной колонки
          let fromList: Card[] = [];
          if (fromColumn === '1') {
            fromList = board.todo;
          } else if (fromColumn === '2') {
            fromList = board.inProgress;
          } else if (fromColumn === '3') {
            fromList = board.done;
          }

          const cardIndex = fromList.findIndex((c) => c._id === movedCard._id);
          if (cardIndex !== -1) {
            fromList.splice(cardIndex, 1); // Удаляем карточку из исходной колонки
          }

          // Добавляем карточку в новую колонку на позицию toIndex
          let toList: Card[] = [];
          if (toColumn === '1') {
            toList = board.todo;
          } else if (toColumn === '2') {
            toList = board.inProgress;
          } else if (toColumn === '3') {
            toList = board.done;
          }

          toList.splice(Number(toIndex), 0, movedCard); // Вставляем карточку в новую колонку по индексу
        }
      });
  },
});

// Экспортируем редьюсер
export default boardSlice.reducer;
