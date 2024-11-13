import React, { useState } from "react";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTasks([...tasks, inputValue]);
      setInputValue("");
    }
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
  <h2>Just do it</h2>
  <input
    type="text"
    placeholder="Add task..."
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={handleAddTask}
  />
  <ul>
    {tasks.length === 0 ? (
      <li className="no-tasks">No more tasks</li>
    ) : (
      tasks.map((task, index) => (
        <li
          key={index}
          onMouseEnter={() => document.getElementById(`delete-${index}`).style.display = "inline"}
          onMouseLeave={() => document.getElementById(`delete-${index}`).style.display = "none"}
        >
          {task}
          <span
            id={`delete-${index}`}
            onClick={() => handleDeleteTask(index)}
          >
            ✕
          </span>
        </li>
      ))
    )}
  </ul>
</div>
  );
}

export default TodoList;