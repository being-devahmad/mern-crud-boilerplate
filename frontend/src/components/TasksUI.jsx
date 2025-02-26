import { useState } from "react";
import { TaskProvider, useTaskManager } from "../../context/TaskContext";

function TaskList() {
  const { tasks, isLoading, error, updateTask, deleteTask } = useTaskManager();
  const [editingTask, setEditingTask] = useState(null);

  if (isLoading) return <div className="text-center">Loading tasks...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const handleToggleComplete = (task) => {
    updateTask(task._id, { ...task, completed: !task.completed });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTask(editingTask._id, {
      title: e.target.title.value,
      description: e.target.description.value,
    });
    setEditingTask(null);
  };

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task._id} className="bg-white shadow-md rounded-lg p-4">
          {editingTask && editingTask._id === task._id ? (
            <form onSubmit={handleUpdate} className="space-y-2">
              <input
                type="text"
                name="title"
                defaultValue={task.title}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="description"
                defaultValue={task.description}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3
                className={`text-lg font-semibold ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </h3>
              <p
                className={`text-gray-600 ${
                  task.completed ? "line-through" : ""
                }`}
              >
                {task.description}
              </p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`px-3 py-1 rounded ${
                    task.completed
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function TaskForm() {
  const { addTask } = useTaskManager();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
}

function TasksUI() {
  return (
    <TaskProvider>
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>
        <TaskForm />
        <TaskList />
      </div>
    </TaskProvider>
  );
}

export default TasksUI;
