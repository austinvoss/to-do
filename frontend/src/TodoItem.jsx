import React from "react";

function TodoItem({ todo, onDelete, onToggleComplete }) {
  const handleToggleComplete = () => {
    onToggleComplete(todo);
  };

  const handleDelete = () => {
    onDelete(todo);
  };

  return (
    <li
      className={`cursor-pointer ${
        todo.completed ? "line-through text-gray-500" : ""
      }`}
    >
      <span onClick={handleToggleComplete}>{todo.text}</span>
      <button
        onClick={() => onDelete(todo)}
        className="ml-2 text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
