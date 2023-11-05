import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import TaskManager from "./components/taskmanager";

const AppLayout = () => {
  return (
    <div className="app">
      <TaskManager/>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout/>);
