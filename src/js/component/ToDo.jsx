import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const AddTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTasks([...tasks, inputValue.trim()]);
      setInputValue("");
    }
  };
  const DeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
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
        className="task-input"/>
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
                key={index} className="task-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  {task}
                <span className="delete-task" onClick={() => DeleteTask(index)}> <i className="fas fa-trash-alt"></i></span>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default TodoList;
