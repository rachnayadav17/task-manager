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

  useEffect(() => {
    axios.get(API).then((response) => {
      setTasks(response.data);
    });
  }, []);

  const handleAddTask = () => {
    if (newTask.title) {
      axios.post(API,newTask).then((response) => {
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

    axios.put(API + '/' + taskId, updatedTasks[taskIndex]).then(() => {
      setTasks(updatedTasks);
    });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(API + '/' + taskId).then(() => {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    });
  };
  return (
    < div className="container">
      <h1>Task Manager</h1>
      <div>
        
        <label for="date">Title</label>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <label for="date">Description</label>
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <label for="date">Due Date</label>
        <input
          type="date"
          placeholder="Due Date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
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
                  <>
                    <button onClick={() => handleMarkComplete(task.id)}>
                      Mark Complete
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)}>
                      Delete
                    </button>
                  </>
                )}
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
