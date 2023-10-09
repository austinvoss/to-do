import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos, onDelete, filter, onToggleComplete }) {
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }
    if (filter === "completed") {
      return todo.completed;
    }
    return true; // "all" filter, show all items
  });
  return (
    <ul>
      {filteredTodos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
