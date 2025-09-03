import React, { useEffect, useState } from "react";
import { categories } from "../utils/constants";

const AddTaskForm = ({ initial = null, onClose, onSave, selectedDate, darkMode }) => {
  const [formData, setFormData] = useState(
    initial
      ? { ...initial, tags: (initial.tags || []).join(", ") }
      : {
          title: "",
          description: "",
          category: "Work",
          startTime: "",
          endTime: "",
          priority: "medium",
          tags: "",
          alarmTime: "",
          recurring: ""
        }
  );

  useEffect(() => {
    if (!initial && formData.startTime) {
      setFormData((f) => ({ ...f, alarmTime: f.startTime }));
    }
  }, [formData.startTime, initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: typeof formData.tags === "string" ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : formData.tags
    };
    onSave && onSave(payload);
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className={`w-full max-w-md p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{initial ? "Edit Task" : "Add Task"}</h3>
          <button type="button" onClick={onClose} className="text-xl">×</button>
        </div>

        <input
          required
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 rounded border mb-2"
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-3 rounded border mb-2"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-2 mb-2">
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="p-3 rounded border">
            {categories.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="p-3 rounded border">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex gap-2 mb-2">
          <input required type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="flex-1 p-3 rounded border" />
          <input required type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="flex-1 p-3 rounded border" />
        </div>

        <input type="time" value={formData.alarmTime} onChange={(e) => setFormData({ ...formData, alarmTime: e.target.value })} className="w-full p-3 rounded border mb-2" />

        <div className="flex items-center gap-2 mb-2">
          <input id="rec" type="checkbox" checked={!!formData.recurring} onChange={(e) => setFormData({ ...formData, recurring: e.target.checked ? "daily" : "" })} />
          <label htmlFor="rec">Recurring daily</label>
        </div>

        <input placeholder="Tags (comma separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full p-3 rounded border mb-4" />

        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded bg-gray-200">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white">{initial ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;