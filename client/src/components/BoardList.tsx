import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import Board from './Board';
import { v4 as uuidv4 } from 'uuid';
import {
  fetchBoards,
  deleteBoard,
  deleteCard,
  updateCard,
  addCard,
  moveCard,
  createBoard,
} from '../redux/boardSlice';
import '../styles/BoardList.css'; // Importing CSS for styling

const BoardList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.boards.boards); // Use Redux state for boards
  const [currentBoardId, setCurrentBoardId] = useState<string>(''); // Store current board ID for search/filter
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch boards on mount
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  // Filter boards by the current board ID
  const filteredBoards = currentBoardId
    ? boards.filter((board) => board._id === currentBoardId)
    : [];

  // Search submit handler
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchTerm = event.currentTarget.searchBar.value.trim(); // Get search input
    setCurrentBoardId(searchTerm); // Set current board ID for filtering
    event.currentTarget.searchBar.value = ''; // Clear input
  };

  // Refresh boards after an action
  const refreshBoards = () => {
    dispatch(fetchBoards());
  };

  // Handle card operations with a refresh
  const handleDeleteCard = (
    boardId: string,
    columnNumber: string,
    cardId: string,
  ) => {
    dispatch(deleteCard({ boardId, columnNumber, cardId })).then(() =>
      refreshBoards(),
    ); // Refresh boards after delete
  };

  const handleEditCard = (
    boardId: string,
    columnNumber: string,
    cardId: string,
    newTitle: string,
    newDescription: string,
  ) => {
    dispatch(
      updateCard({
        boardId,
        columnNumber,
        cardId,
        title: newTitle,
        description: newDescription,
      }),
    )
      .then(() => {
        refreshBoards();
      })
      .catch((error) => {
        console.error('Error updating card:', error);
      });
  };

  const handleAddCard = (
    boardId: string,
    index: string,
    columnNumber: string,
    title: string,
    description: string,
  ) => {
    dispatch(
      addCard({ boardId, index, columnNumber, title, description }),
    ).then(() => refreshBoards()); // Refresh boards after add
  };

  const handleMoveCard = (
    boardId: string,
    fromColumn: string,
    toColumn: string,
    cardId: string,
    toIndex: string,
  ) => {
    dispatch(moveCard({ boardId, fromColumn, toColumn, cardId, toIndex })).then(
      () => refreshBoards(),
    ); // Refresh boards after add
  };
  // Handle creation of a new board
  const handleCreateBoard = async () => {
    const boardName = prompt('Enter the name for the new board:');
    if (boardName) {
      const boardId = uuidv4(); // Generate a unique ID for the board
      try {
        const resultAction = await dispatch(
          createBoard({ name: boardName, _id: boardId }),
        ); // Include the ID in the payload
        if (createBoard.fulfilled.match(resultAction)) {
          setCurrentBoardId(boardId); // Set the newly created board ID
        }
        refreshBoards();
      } catch (error) {
        setErrorMessage('Failed to create board. Please try again.' + error);
      }
    }
  };
  // Handle delete board operation
  const handleDeleteBoard = async (boardId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this board?',
    );
    if (confirmDelete) {
      try {
        await dispatch(deleteBoard(boardId)); // Теперь это асинхронно
        refreshBoards(); // Обновляем доски после удаления
      } catch (error) {
        console.error('Failed to delete board:', error);
      }
    }
  };

  return (
    <div className="board-list">
      <div className="top-bar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            id="searchBar"
            name="searchBar"
            type="text"
            placeholder="Search boards by ID..."
          />
          <button type="submit">Search</button>
        </form>
        <button onClick={handleCreateBoard}>Create New Board</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="board-columns">
        {filteredBoards.length > 0 ? (
          filteredBoards.map((board) => (
            <div key={board._id} className="board-item">
              <Board
                _id={board._id}
                name={board.name}
                todo={board.todo}
                inProgress={board.inProgress}
                done={board.done}
                onDeleteCard={handleDeleteCard}
                onEditCard={handleEditCard}
                addCard={handleAddCard}
                moveCard={handleMoveCard}
              />
              <button
                className="delete-button"
                onClick={() => handleDeleteBoard(board._id)}
              >
                Delete Board
              </button>
            </div>
          ))
        ) : (
          <p className="no-boards-text">No boards found :(</p>
        )}
      </div>
    </div>
  );
};

export default BoardList;
