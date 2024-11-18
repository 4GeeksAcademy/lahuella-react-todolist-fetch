import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const API_URL = "https://playground.4geeks.com/todo/openapi.json";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Error al cargar las tareas");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTask = inputValue.trim();
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: newTask }),
        });
        if (response.ok) {
          setTasks([...tasks, newTask]);
          setInputValue("");
        } else {
          console.error("Error al agregar la tarea");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    }
  };

  const deleteTask = async (index) => {
    const taskToDelete = tasks[index];
    try {
      const response = await fetch(`${API_URL}/${taskToDelete.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTasks(tasks.filter((_, i) => i !== index));
      } else {
        console.error("Error al eliminar la tarea");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const clearAllTasks = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
      });
      if (response.ok) {
        setTasks([]);
      } else {
        console.error("Error al limpiar las tareas");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="container">
      <h2>Just do it</h2>

      <p className="task-counter">
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"} remaining
      </p>
      <input
        type="text"
        placeholder="Add a new task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={addTask}
        className="task-input"
      />
      <button onClick={clearAllTasks} className="clear-button">
        Clear All Tasks
      </button>
      <ul className="task-list">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.li
              className="no-tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No more tasks
            </motion.li>
          ) : (
            tasks.map((task, index) => (
              <motion.li
                key={index}
                className="task-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {task}
                <span
                  className="delete-task"
                  onClick={() => deleteTask(index)}
                >
                  <i className="fas fa-trash-alt"></i>
                </span>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;