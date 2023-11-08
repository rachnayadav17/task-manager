import axios from "axios";
import { useEffect, useState } from "react";

const TaskManager = () => {
  const API = "http://localhost:8080/api/task";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newTask.title.trim()) {
      errors.title = "Title is required";
    }
    if (!newTask.description.trim()) {
      errors.description = "Description is required";
    }
    if (!newTask.dueDate) {
      errors.dueDate = "Due Date is required";
    } else {
      const dueDate = new Date(newTask.dueDate);
      const currentDate = new Date();
      if (dueDate <= currentDate) {
        errors.dueDate = "Due Date must be in the future";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    axios.get(API).then((response) => {
      setTasks(response.data);
    });
  }, []);

  const handleAddTask = () => {
    if (validateForm()) {
      axios.post(API, newTask).then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask({
          title: "",
          description: "",
          dueDate: "",
          completed: false,
        });
      });
    }
  };

  const handleMarkComplete = (taskId) => {
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((task) => task.id === taskId);
    updatedTasks[taskIndex].completed = true;

    axios.put(API + "/" + taskId, updatedTasks[taskIndex]).then(() => {
      setTasks(updatedTasks);
    });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(API + "/" + taskId).then(() => {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    });
  };
  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className={formErrors.title ? "error-input" : ""}
        />
        {formErrors.title && (
          <div className="error-message">{formErrors.title}</div>
        )}

        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className={formErrors.description ? "error-input" : ""}
        />
        {formErrors.description && (
          <div className="error-message">{formErrors.description}</div>
        )}

        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className={formErrors.dueDate ? "error-input" : ""}
        />
        {formErrors.dueDate && (
          <div className="error-message">{formErrors.dueDate}</div>
        )}

        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <h2>Task List</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate}</td>
                <td>{task.completed ? "Completed" : "Pending"}</td>
                <td>
                  {!task.completed && (
                    <button onClick={() => handleMarkComplete(task.id)}>
                      Mark Complete
                    </button>
                  )}
                  <button onClick={() => handleDeleteTask(task.id)} id="deleteButton">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;
