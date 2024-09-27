import React, { useState } from 'react';
import { Card as CardType } from '../redux/types';
import { useDrag } from 'react-dnd';
import '../styles/Card.css';

interface CardProps extends CardType {
  onDelete: (_id: string) => void;
  onEdit: (_id: string, title: string, description: string) => void;
  fromColumn: string; // Add this prop
}

const Card: React.FC<CardProps> = ({
  _id,
  index,
  title,
  description,
  fromColumn,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { _id, index, fromColumn }, // Pass fromColumn here
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleSave = () => {
    if (newTitle.trim() === '' || newDescription.trim() === '') {
      alert('Title and description cannot be empty.');
      return;
    }
    onEdit(_id, newTitle, newDescription);
    setIsEditing(false);
  };

  return (
    <div
      ref={drag}
      className={`card ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }} // Visual feedback for dragging
    >
      {isEditing ? (
        <div className="card-edit">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Card Title"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Card Description"
          />
          <div className="card-buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card-view">
          <h4>{title}</h4>
          <p>{description}</p>
          <div className="card-buttons">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(_id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
