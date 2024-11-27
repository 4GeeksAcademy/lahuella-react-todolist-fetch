import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const initializeUser = async () => {
      const response = await fetch('https://playground.4geeks.com/todo/users/lahuella');
      if (response.status === 404) {
        await fetch('https://playground.4geeks.com/todo/users/lahuella', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: "lahuella" }),
        });
      }
      const tasksResponse = await fetch('https://playground.4geeks.com/todo/users/lahuella');
      const tasksData = await tasksResponse.json();
      setTasks(tasksData.todos || []);
    };
    initializeUser();
  }, []);
  const createTodo = async (task) => {
    const response = await fetch('https://playground.4geeks.com/todo/todos/lahuella', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: task, is_done: false }),
    });

    const newTask = await response.json();
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const addTask = async (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      await createTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const deleteTask = async (taskId) => {
    await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'DELETE',
      headers: { accept: 'application/json' },
    });

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const deleteAllTasks = async () => {
    const deleteAll = tasks.map(item => deleteTask(item.id))
    await Promise.all(deleteAll).then(() => setTasks([]));
  };

  const editTask = async (taskId, newLabel) => {
    await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newLabel, is_done: false }),
    });

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, label: newLabel } : task
      )
    );
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
      <div className="button-container">
        <button onClick={deleteAllTasks} className="delete-all-tasks">
          Eliminar todas las tareas
        </button>
      </div>
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
            tasks.map((task) => (
              <motion.li
                key={task.id}
                className={`task-item ${task.is_done ? 'completed' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  value={task.label}
                  onChange={(e) => editTask(task.id, e.target.value)}
                  className="task-edit-input"
                />
                <span
                  className="delete-task"
                  onClick={() => deleteTask(task.id)}
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
};

export default ToDo;
