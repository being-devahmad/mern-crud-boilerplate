"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const TaskContext = createContext();

// eslint-disable-next-line react/prop-types
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError(null);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch tasks");
    }
    setIsLoading(false);
  }, []);

  const addTask = async (title, description) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title,
        description,
      });
      setTasks([...tasks, response.data]);
      return response.data;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to add task");
      return null;
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      return response.data;
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to update task");
      return null;
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      return true;
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to delete task");
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskManager = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskManager must be used within a TaskProvider");
  }
  return context;
};
