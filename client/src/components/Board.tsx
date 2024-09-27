import React from 'react';
import { Board as BoardType } from '../redux/types';
import Card from './Card';
import { useDrop } from 'react-dnd';
import '../styles/Board.css';

interface BoardProps extends BoardType {
  onDeleteCard: (boardId: string, columnNumber: string, cardId: string) => void;
  onEditCard: (
    boardId: string,
    columnNumber: string,
    cardId: string,
    title: string,
    description: string,
  ) => void;
  addCard: (
    boardId: string,
    index: string,
    columnNumber: string,
    title: string,
    description: string,
  ) => void;
  moveCard: (
    boardId: string,
    fromColumn: string,
    toColumn: string,
    cardId: string,
    toIndex: string,
  ) => void;
}

const Board: React.FC<BoardProps> = ({
  _id,
  name,
  todo,
  inProgress,
  done,
  onDeleteCard,
  onEditCard,
  addCard,
  moveCard,
}) => {
  const [{ isOver: isOverTodo }, dropTodo] = useDrop({
    accept: 'CARD',
    drop: (item: { _id: string; fromColumn: string }) => {
      const toIndex = todo.length.toString();
      moveCard(_id, item.fromColumn, '1', item._id, toIndex);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isOver: isOverInProgress }, dropInProgress] = useDrop({
    accept: 'CARD',
    drop: (item: { _id: string; fromColumn: string }) => {
      const toIndex = inProgress.length.toString();
      moveCard(_id, item.fromColumn, '2', item._id, toIndex);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isOver: isOverDone }, dropDone] = useDrop({
    accept: 'CARD',
    drop: (item: { _id: string; fromColumn: string }) => {
      const toIndex = done.length.toString();
      moveCard(_id, item.fromColumn, '3', item._id, toIndex);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(_id);
    alert(`ID ${_id} скопирован в буфер обмена`);
  };

  return (
    <div className="board">
      <h2>Board &quot;{name}&quot;</h2>
      <h4>
        ID -{' '}
        <span
          onClick={handleCopyId}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          {_id}
        </span>
      </h4>
      <div className="board-columns">
        {/* To Do Column */}
        <div ref={dropTodo} className={`column ${isOverTodo ? 'hover' : ''}`}>
          <h3>To Do</h3>
          {todo.map((card) => (
            <Card
              key={card._id}
              {...card}
              fromColumn="1"
              onDelete={() => onDeleteCard(_id, '1', card._id)}
              onEdit={(newId, newTitle, newDescription) =>
                onEditCard(_id, '1', newId, newTitle, newDescription)
              }
            />
          ))}
          <button
            className="add-card-button"
            onClick={() =>
              addCard(
                _id,
                todo.length.toString(),
                '1',
                'New Task',
                'Description',
              )
            }
          >
            +
          </button>
        </div>

        {/* In Progress Column */}
        <div
          ref={dropInProgress}
          className={`column ${isOverInProgress ? 'hover' : ''}`}
        >
          <h3>In Progress</h3>
          {inProgress.map((card) => (
            <Card
              key={card._id}
              {...card}
              fromColumn="2"
              onDelete={() => onDeleteCard(_id, '2', card._id)}
              onEdit={(newId, newTitle, newDescription) =>
                onEditCard(_id, '2', newId, newTitle, newDescription)
              }
            />
          ))}
          <button
            className="add-card-button"
            onClick={() =>
              addCard(
                _id,
                inProgress.length.toString(),
                '2',
                'New Task',
                'Description',
              )
            }
          >
            +
          </button>
        </div>

        {/* Done Column */}
        <div ref={dropDone} className={`column ${isOverDone ? 'hover' : ''}`}>
          <h3>Done</h3>
          {done.map((card) => (
            <Card
              key={card._id}
              {...card}
              fromColumn="3"
              onDelete={() => onDeleteCard(_id, '3', card._id)}
              onEdit={(newId, newTitle, newDescription) =>
                onEditCard(_id, '3', newId, newTitle, newDescription)
              }
            />
          ))}
          <button
            className="add-card-button"
            onClick={() =>
              addCard(
                _id,
                done.length.toString(),
                '3',
                'New Task',
                'Description',
              )
            }
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
