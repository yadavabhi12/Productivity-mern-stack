// Constants and default values
export const DEFAULT_SNOOZE_MINUTES = 5;

export const categories = [
  { name: "Work", color: "bg-blue-500", productive: true, icon: "💼" },
  { name: "Study", color: "bg-purple-500", productive: true, icon: "📚" },
  { name: "Health", color: "bg-green-500", productive: true, icon: "💪" },
  { name: "Break", color: "bg-yellow-500", productive: false, icon: "☕" },
  { name: "Sleep", color: "bg-indigo-500", productive: false, icon: "😴" },
  { name: "Other", color: "bg-gray-500", productive: false, icon: "📝" }
];

export const quotes = [
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't let yesterday take up too much of today. - Will Rogers",
  "You learn more from failure than from success. - Unknown",
  "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
];

export const achievements = [
  { id: 1, title: "Early Bird", description: "Complete 5 morning tasks", icon: "🌅" },
  { id: 2, title: "Productivity Master", description: "Achieve 80% productivity for 7 days", icon: "🏆" },
  { id: 3, title: "Streak Champion", description: "Maintain 30-day streak", icon: "🔥" },
  { id: 4, title: "Focus Ninja", description: "Complete 10 deep work sessions", icon: "🥷" }
];

export const sampleTasksTemplate = (dateISO) => [
  {
    title: "Morning Workout 💪",
    description: "Full body routine",
    category: "Health",
    startTime: "06:00",
    endTime: "07:30",
    completed: true,
    date: dateISO,
    color: "bg-green-500",
    priority: "high",
    tags: ["fitness", "morning"],
    alarmTime: "",
    alarmEnabled: false,
    ringing: false,
    recurring: ""
  },
  {
    title: "Project Development 🚀",
    description: "Work on React Native features",
    category: "Work",
    startTime: "09:00",
    endTime: "12:00",
    completed: true,
    date: dateISO,
    color: "bg-blue-500",
    priority: "high",
    tags: ["coding"],
    alarmTime: "",
    alarmEnabled: false,
    ringing: false,
    recurring: ""
  },
  {
    title: "Algorithm Study 🧠",
    description: "Practice DP problems",
    category: "Study",
    startTime: "14:00",
    endTime: "16:00",
    completed: false,
    date: dateISO,
    color: "bg-purple-500",
    priority: "medium",
    tags: ["algorithms"],
    alarmTime: "",
    alarmEnabled: false,
    ringing: false,
    recurring: ""
  }
];