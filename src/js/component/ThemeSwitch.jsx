import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

const ThemeSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsOn(true);
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      setIsOn(false);
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (isOn) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="theme-container">
    <h6 className="theme-text">Choose your theme</h6>
    <div className="switch" onClick={toggleSwitch}>
      <motion.div
        className="handle"
        layout
        animate={{ x: isOn ? "100%" : 0 }}
        transition={spring}
      >
        {isOn ? "🌙" : "🌕"}
      </motion.div>
    </div>
    </div>
  );
};

export default ThemeSwitch;
