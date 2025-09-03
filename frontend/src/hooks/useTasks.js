import { useState, useEffect } from "react";
import * as api from "../services/api";
import { sampleTasksTemplate, categories } from "../utils/constants";

export const useTasks = (selectedDate) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks(selectedDate);
  }, [selectedDate]);

  const loadTasks = async (date) => {
    try {
      const res = await api.getTasks(date);
      if (!res || res.length === 0) {
        const sample = sampleTasksTemplate(date);
        setTasks(res.length ? res : sample);
      } else {
        setTasks(res);
      }
    } catch (e) {
      console.warn("load tasks failed", e);
      setTasks(sampleTasksTemplate(date));
    }
  };

  const addOrUpdateTask = async (data, initial = null) => {
    try {
      const alarmEnabled = !!data.alarmTime;
      if (initial && initial._id) {
        const payload = {
          ...initial,
          title: data.title,
          description: data.description,
          category: data.category,
          startTime: data.startTime,
          endTime: data.endTime,
          priority: data.priority,
          tags: data.tags || [],
          alarmTime: data.alarmTime || "",
          alarmEnabled,
          recurring: data.recurring || "",
          ringing: alarmEnabled ? initial.ringing : false
        };
        const updated = await api.updateTask(initial._id, payload);
        setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
      } else {
        const newTask = {
          ...data,
          date: selectedDate,
          color: categories.find((c) => c.name === data.category)?.color || "bg-gray-500",
          completed: false,
          alarmTime: data.alarmTime || "",
          alarmEnabled,
          ringing: false,
          recurring: data.recurring || ""
        };
        const created = await api.createTask(newTask);
        setTasks((prev) => [...prev, created]);
      }
    } catch (e) {
      console.warn("addOrUpdateTask failed", e);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const updated = await api.updateTask(task._id, { ...task, completed: !task.completed });
      setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
    } catch (e) {
      console.warn("toggleComplete failed", e);
    }
  };

  const deleteTask = async (id) => {
    try {
      const t = tasks.find((x) => x._id === id);
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((x) => x._id !== id));
      return t;
    } catch (e) {
      console.warn("deleteTask failed", e);
    }
  };

  return {
    tasks,
    setTasks,
    addOrUpdateTask,
    toggleComplete,
    deleteTask,
    loadTasks
  };
};