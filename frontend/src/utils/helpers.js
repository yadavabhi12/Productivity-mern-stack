// Helper functions
export const formatHM = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

export const getMonthMatrix = (dateISO) => {
  const date = new Date(dateISO + "T00:00:00");
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let week = new Array(7).fill(null);
  let dayCounter = 1;
  for (let i = startDay; i < 7; i++) week[i] = new Date(year, month, dayCounter++);
  matrix.push(week);
  while (dayCounter <= daysInMonth) {
    const nextWeek = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) nextWeek[i] = new Date(year, month, dayCounter++);
    matrix.push(nextWeek);
  }
  return matrix;
};

export const lastNDates = (n) => {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().split("T")[0]);
  }
  return arr;
};

export const calculateDailyStats = (tasks, dateISO, categories) => {
  const todayTasks = tasks.filter((t) => t.date === dateISO);
  let productiveMinutes = 0;
  let totalMinutes = 0;
  todayTasks.forEach((task) => {
    if (!task.startTime || !task.endTime) return;
    const start = new Date(`2000-01-01 ${task.startTime}`);
    const end = new Date(`2000-01-01 ${task.endTime}`);
    const duration = (end - start) / (1000 * 60);
    if (isNaN(duration) || duration <= 0) return;
    totalMinutes += duration;
    const cat = categories.find((c) => c.name === task.category);
    if (cat && cat.productive) productiveMinutes += duration;
  });
  const utilization = totalMinutes > 0 ? (productiveMinutes / (24 * 60)) * 100 : 0;
  return {
    productiveHours: Math.round((productiveMinutes / 60) * 10) / 10,
    totalTrackedHours: Math.round((totalMinutes / 60) * 10) / 10,
    utilizationPercentage: Math.round(utilization * 10) / 10,
    tasksCompleted: todayTasks.filter((t) => t.completed).length,
    totalTasks: todayTasks.length,
    focusScore: totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0
  };
};

export const categoryDistribution = (tasks, categories) => {
  const map = {};
  tasks.forEach((t) => {
    if (!map[t.category]) map[t.category] = 0;
    if (t.startTime && t.endTime) {
      const start = new Date(`2000-01-01 ${t.startTime}`);
      const end = new Date(`2000-01-01 ${t.endTime}`);
      const diff = (end - start) / (1000 * 60);
      map[t.category] += isNaN(diff) ? 0 : diff;
    }
  });
  return Object.entries(map).map(([k, minutes]) => ({ category: k, hours: Math.round((minutes / 60) * 10) / 10 }));
};