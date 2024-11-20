import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/users/lahuella')
      .then(resp => resp.json())
      .then(respJson => {
        console.log(respJson);
        if (respJson.todos) {
          setTasks(respJson.todos);
        }
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const createTodo = async (task) => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/todos/lahuella', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label: task, is_done: false }),
      });

      if (!response.ok) {
        throw new Error(`Error Creating Task: ${response.statusText}`);
      }

      const newTask = await response.json();
      console.log('New Task Created:', newTask);

      setTasks((prevTasks) => [...prevTasks, newTask]);

    } catch (error) {
      console.error('Error Adding Task:', error);
    }
  };

  const AddTask = async (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      await createTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const DeleteTaskByIndex = async (taskId) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
        method: 'DELETE',
        headers: { 'accept': 'application/json', },
      });

      if (!response.ok) {
        throw new Error(`Error trying to eliminate task: ${response.statusText}`);
      }

      setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
      console.log('Task Deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/lahuella', {
        method: 'DELETE',
        headers: {'accept': 'application/json',},
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar todas las tareas: ${response.statusText}`);
      }
      setTasks([]);
      console.log('Todas las tareas han sido eliminadas correctamente');
    } catch (error) {
      console.error('Error eliminando todas las tareas:', error);
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
        onKeyDown={AddTask}
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
                className="task-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {task.label}
                <span className="delete-task" 
                onClick={() => DeleteTaskByIndex(task.id)}>
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

