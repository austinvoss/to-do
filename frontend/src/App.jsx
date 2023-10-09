import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import AddTodo from "./AddTodo";

function App() {
  const [todos, setTodos] = useState([]);

  // Fetch todos from the backend
  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, []);

  const addTodo = (text) => {
    fetch("http://localhost:3000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
      })
      .catch((err) => console.error("Error adding todo:", err));
  };

  const [filter, setFilter] = useState("all"); // "all", "active", or "completed"

  const deleteTodo = (todoToDelete) => {
    const updatedTodos = todos.filter((todo) => todo !== todoToDelete);
    setTodos(updatedTodos);

    // New logic to delete todo in the database
    fetch(`http://localhost:3000/api/todos/${todoToDelete.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Todo deleted successfully:", data);
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const onToggleComplete = (clickedTodo) => {
    // Step 1: Update the local React state
    const updatedTodos = todos.map((todo) => {
      if (todo.id === clickedTodo.id) {
        // Compare using unique ID
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);

    // Step 2: Find the updated todo by its unique ID
    const updatedTodo = updatedTodos.find((todo) => todo.id === clickedTodo.id);

    // Step 3: Update the database
    fetch(`http://localhost:3000/api/todos/${updatedTodo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updatedTodo.completed }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Optionally, you can log the response or do additional actions
        console.log("Todo updated successfully:", data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error updating todo:", error);
      });
  };

  return (
    <div className="App">
      <h1 className="text-3xl">To-Do List</h1>
      <AddTodo onAdd={addTodo} />
      <div>
        <button
          className={`mx-2 ${
            filter === "all" ? "bg-blue-500" : "bg-gray-200"
          } text-white px-2 py-1 rounded`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`mx-2 ${
            filter === "active" ? "bg-blue-500" : "bg-gray-200"
          } text-white px-2 py-1 rounded`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`mx-2 ${
            filter === "completed" ? "bg-blue-500" : "bg-gray-200"
          } text-white px-2 py-1 rounded`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
      <TodoList
        todos={todos}
        onDelete={deleteTodo}
        filter={filter}
        onToggleComplete={onToggleComplete}
      />
    </div>
  );
}

export default App;
