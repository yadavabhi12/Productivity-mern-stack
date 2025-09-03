// API service functions
const API_BASE = "https://productivity-mern-stack.onrender.com/api";

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getTasks(date) {
  const url = `${API_BASE}/tasks${date ? `?date=${encodeURIComponent(date)}` : ""}`;
  return fetchJSON(url);
}

export async function createTask(task) {
  return fetchJSON(`${API_BASE}/tasks`, { method: "POST", body: JSON.stringify(task) });
}

export async function updateTask(id, task) {
  return fetchJSON(`${API_BASE}/tasks/${id}`, { method: "PUT", body: JSON.stringify(task) });
}

export async function deleteTask(id) {
  return fetchJSON(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
}

export async function getSettings() {
  return fetchJSON(`${API_BASE}/settings`);
}

export async function updateSettings(payload) {
  return fetchJSON(`${API_BASE}/settings`, { method: "PUT", body: JSON.stringify(payload) });
}

export function downloadExport() {
  window.open(`${API_BASE}/export`, "_blank");
}