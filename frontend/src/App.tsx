import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Clock,
  BarChart3,
  Calendar as CalendarIcon,
  User,
  Play,
  Pause,
  Trash2,
  Edit3,
  CheckCircle,
  Circle,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Star,
  Brain,
  Moon,
  Sun,
  Siren as Fire,
  Timer,
  Bell,
  ChevronRight,
  Settings,
  Download,
  Share2,
  Search,
  Award,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Home,
  PieChart,
  Coffee,
  Dumbbell,
  BookOpen,
  Briefcase,
  Bed,
  X,
  Menu
} from "lucide-react";

import AddTaskForm from "./components/AddTaskForm";
import TaskCard from "./components/TaskCard";
import StatsCard from "./components/StatsCard";
import AnalyticsContent from "./components/AnalyticsContent";
import CalendarContent from "./components/CalendarContent";
import ProfileContent from "./components/ProfileContent";

import { useTasks } from "./hooks/useTasks";
import { useSettings } from "./hooks/useSettings";
import { usePomodoro } from "./hooks/usePomodoro";
import { useAlarms } from "./hooks/useAlarms";

import { quotes, categories } from "./utils/constants";
import { formatHM, calculateDailyStats } from "./utils/helpers";

const ProductivityApp = () => {
  const todayISO = new Date().toISOString().split("T")[0];

  const [activeTab, setActiveTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showStats, setShowStats] = useState(true);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [showQuote, setShowQuote] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [testSound, setTestSound] = useState(false);

  const { tasks, setTasks, addOrUpdateTask, toggleComplete, deleteTask } = useTasks(selectedDate);
  const { settings, saveSettings } = useSettings();
  const { pomodoro, startPomodoro, pausePomodoro, resetPomodoro, setPomodoro } = usePomodoro();
  const { startBeep, stopBeep, snoozeAlarm, stopAlarm, toggleAlarmEnabled, triggerManualAlarm } = useAlarms(tasks, setTasks);

  const alarmIntervalRef = useRef(null);
  const quoteIntervalRef = useRef(null);

  // New feature: Quick actions
  const quickActions = [
    { icon: <Coffee className="w-4 h-4" />, label: "Break", duration: 15, color: "from-amber-200 to-amber-300" },
    { icon: <Dumbbell className="w-4 h-4" />, label: "Workout", duration: 45, color: "from-emerald-200 to-emerald-300" },
    { icon: <BookOpen className="w-4 h-4" />, label: "Study", duration: 60, color: "from-violet-200 to-violet-300" },
    { icon: <Briefcase className="w-4 h-4" />, label: "Work", duration: 90, color: "from-blue-200 to-blue-300" }
  ];

  useEffect(() => {
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    // Rotate quotes every 30 seconds
    quoteIntervalRef.current = setInterval(() => {
      setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 30000);

    return () => {
      if (quoteIntervalRef.current) clearInterval(quoteIntervalRef.current);
    };
  }, []);

  // Test sound function
  const testAlarmSound = () => {
    setTestSound(true);
    if (soundEnabled) {
      startBeep();
      setTimeout(() => {
        stopBeep();
        setTestSound(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTasks((prev) => prev.map((task) => {
        if (!task.alarmEnabled || task.ringing) return task;
        if (!task.alarmTime || !task.date) return task;
        
        const alarmDateTime = new Date(`${task.date}T${task.alarmTime}`);
        if (isNaN(alarmDateTime.getTime())) return task;
        
        // Check if current time is within 1 minute of alarm time
        if (now >= alarmDateTime && now - alarmDateTime < 60 * 1000) {
          if (soundEnabled && !task.ringing) {
            startBeep();
          }
          return { ...task, ringing: true };
        }
        return task;
      }));
    }, 1000);
    
    alarmIntervalRef.current = id;
    return () => clearInterval(id);
  }, [setTasks, startBeep, soundEnabled]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || task.category === filterCategory;
    const matchesDate = task.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const statsToday = calculateDailyStats(tasks, selectedDate, categories);

  // New feature: Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    saveSettings({ ...settings, darkMode: newDarkMode });
  };

  // New feature: Quick add task from template
  const quickAddTask = (action) => {
    const now = new Date();
    const startTime = now.toTimeString().substr(0, 5);
    
    const endTime = new Date(now.getTime() + action.duration * 60000)
      .toTimeString().substr(0, 5);
    
    const newTask = {
      title: `${action.label} Session`,
      description: `Quick ${action.label.toLowerCase()} session`,
      category: action.label,
      startTime,
      endTime,
      priority: "medium",
      tags: ["quick-add"],
      alarmTime: "",
      recurring: ""
    };
    
    addOrUpdateTask(newTask);
  };

  // New feature: Focus mode (hides everything except current task)
  const [focusMode, setFocusMode] = useState(false);
  const toggleFocusMode = () => setFocusMode(!focusMode);

  // New feature: Daily goals progress
  const dailyGoals = {
    productiveHours: 6,
    tasksCompleted: 5,
    focusScore: 80
  };

  const goalProgress = {
    productiveHours: Math.min(100, Math.round((statsToday.productiveHours / dailyGoals.productiveHours) * 100)),
    tasksCompleted: Math.min(100, Math.round((statsToday.tasksCompleted / dailyGoals.tasksCompleted) * 100)),
    focusScore: Math.min(100, Math.round((statsToday.focusScore / dailyGoals.focusScore) * 100))
  };

  if (focusMode) {
    return (
      <div className={`${settings.darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"} min-h-screen flex flex-col items-center justify-center p-4`}>
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">🚀 Focus Mode</h1>
          <p className="text-sm text-gray-500">Minimizing distractions for better productivity</p>
        </div>
        
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 shadow-lg max-w-md w-full">
          <div className="text-center mb-5">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-1 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold">Current Task</h2>
            <p className="text-sm text-gray-500 mt-1">Focus on one thing at a time</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 mb-5">
            <h3 className="font-medium text-center text-sm">{filteredTasks.find(t => !t.completed)?.title || "No active tasks"}</h3>
            {filteredTasks.find(t => !t.completed)?.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                {filteredTasks.find(t => !t.completed)?.description}
              </p>
            )}
          </div>
          
          <div className="flex justify-center gap-3">
            <button 
              onClick={toggleFocusMode}
              className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg"
            >
              Exit Focus Mode
            </button>
            <button 
              onClick={() => toggleComplete(filteredTasks.find(t => !t.completed))}
              className="px-3 py-1.5 text-xs bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg"
            >
              Mark Complete
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Pomodoro Timer: {formatHM(pomodoro.secondsLeft)}</p>
          <button 
            onClick={pomodoro.isRunning ? pausePomodoro : () => startPomodoro(null)}
            className="mt-1 px-2 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded text-xs"
          >
            {pomodoro.isRunning ? 'Pause' : 'Start'} Timer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${settings.darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"} min-h-screen pb-24 transition-colors duration-300`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${settings.darkMode ? "from-gray-800 to-gray-900" : "from-blue-400 to-purple-500"} shadow-md p-3 sticky top-0 z-40 transition-colors duration-300 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2 p-1 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 md:hidden"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div>
              <h1 className="text-lg font-bold flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-300" />
                Productivity Tracker
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  className="text-xs rounded-md px-1.5 py-1 bg-white bg-opacity-20 text-white placeholder:text-gray-300" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
              <Timer className="w-3 h-3 text-white" />
              <div className="text-xs font-mono text-white">{formatHM(pomodoro.secondsLeft)}</div>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <div className="text-xs font-medium text-white">{statsToday.productiveHours}h productive</div>
              <div className="text-2xs text-gray-300">{statsToday.utilizationPercentage}% utilization</div>
            </div>
            
            <div className="flex gap-1">
              <button 
                onClick={testAlarmSound}
                className="p-1.5 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 relative"
                title="Test alarm sound"
                disabled={testSound}
              >
                <Bell className="w-3.5 h-3.5 text-white" />
                {testSound && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30"
                title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5 text-white" />}
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="p-1.5 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30"
                title="Toggle dark mode"
              >
                {settings.darkMode ? <Sun className="w-3.5 h-3.5 text-white" /> : <Moon className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-3/4 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-lg p-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Menu</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1">
              {[
                { id: "home", icon: Home, label: "Tasks" },
                { id: "analytics", icon: BarChart3, label: "Analytics" },
                { id: "calendar", icon: CalendarIcon, label: "Calendar" },
                { id: "profile", icon: User, label: "Profile" }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center p-2 rounded-md ${isActive ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300" : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800"}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-sm mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => quickAddTask(action)}
                    className={`p-1.5 rounded-md text-gray-800 text-xs font-medium bg-gradient-to-r ${action.color} hover:opacity-90 transition-opacity`}
                  >
                    {action.icon}
                    <span className="block mt-0.5">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="p-3 space-y-4">
        {activeTab === "home" && (
          <>
            {/* Motivational Quote */}
            {showQuote && (
              <div className="bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 rounded-lg p-3 text-gray-800 relative text-xs">
                <button 
                  onClick={() => setShowQuote(false)}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-white bg-opacity-30 hover:bg-opacity-40"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="italic">"{motivationalQuote}"</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="opacity-80 text-2xs">💡 Daily Inspiration</span>
                  <button 
                    onClick={() => setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])}
                    className="text-2xs bg-white bg-opacity-30 px-1.5 py-0.5 rounded hover:bg-opacity-40"
                  >
                    New quote
                  </button>
                </div>
              </div>
            )}

            {/* Daily Goals Progress */}
            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-2 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">Productive Hours</span>
                    <span className="text-2xs text-gray-500">{statsToday.productiveHours}h / {dailyGoals.productiveHours}h</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${goalProgress.productiveHours}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-2 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">Tasks Completed</span>
                    <span className="text-2xs text-gray-500">{statsToday.tasksCompleted} / {dailyGoals.tasksCompleted}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${goalProgress.tasksCompleted}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-2 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">Focus Score</span>
                    <span className="text-2xs text-gray-500">{statsToday.focusScore}% / {dailyGoals.focusScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${goalProgress.focusScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-2 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-xs bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">⚡ Quick Actions</h3>
                <span className="text-2xs text-gray-500">Add common tasks quickly</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => quickAddTask(action)}
                    className={`p-2 rounded-md text-gray-800 flex flex-col items-center justify-center bg-gradient-to-r ${action.color} hover:opacity-90 transition-opacity`}
                  >
                    {action.icon}
                    <span className="text-xs font-medium mt-0.5">{action.label}</span>
                    <span className="text-2xs opacity-80">{action.duration}min</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-8 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm" 
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 flex items-center justify-between text-sm"
                >
                  <span>{filterCategory === "All" ? "All Categories" : filterCategory}</span>
                  {showCategoryFilter ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
                </button>
                
                {showCategoryFilter && (
                  <div className="absolute top-full right-0 mt-0.5 w-40 rounded-lg shadow-lg z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-1 text-sm">
                    <button
                      onClick={() => { setFilterCategory("All"); setShowCategoryFilter(false); }}
                      className={`block w-full text-left px-3 py-1.5 ${filterCategory === "All" ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300" : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800"}`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => { setFilterCategory(category.name); setShowCategoryFilter(false); }}
                        className={`block w-full text-left px-3 py-1.5 ${filterCategory === category.name ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300" : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800"}`}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tasks Section */}
            <section className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-md font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center">
                  <span className="mr-1">📋</span>
                  Today's Tasks
                  <span className="ml-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                    {filteredTasks.length}
                  </span>
                </h2>
                <div className="flex items-center gap-1">
                  <div className="hidden sm:block text-xs bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-medium">{statsToday.focusScore}% focus</div>
                  <button 
                    onClick={() => { setShowStats((s) => !s); }}
                    className="p-1.5 text-gray-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800 rounded-md"
                    title="Toggle stats"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={toggleFocusMode}
                    className="p-1.5 text-gray-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800 rounded-md"
                    title="Enter focus mode"
                  >
                    <Target className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="text-center py-5">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {searchQuery || filterCategory !== "All" ? "No tasks match filters" : "No tasks for today. Add one to get started!"}
                  </p>
                  {!searchQuery && filterCategory === "All" && (
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="mt-3 px-3 py-1.5 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg text-xs"
                    >
                      Add Your First Task
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTasks.map((t) => (
                    <TaskCard 
                      key={t._id || t.title + t.date} 
                      task={t} 
                      darkMode={settings.darkMode}
                      toggleComplete={toggleComplete}
                      deleteTask={deleteTask}
                      startPomodoro={startPomodoro}
                      pausePomodoro={pausePomodoro}
                      pomodoro={pomodoro}
                      setEditing={setEditing}
                      setShowAddModal={setShowAddModal}
                      toggleAlarmEnabled={toggleAlarmEnabled}
                      triggerManualAlarm={triggerManualAlarm}
                      snoozeAlarm={snoozeAlarm}
                      stopAlarm={stopAlarm}
                      stopBeep={stopBeep}
                      soundEnabled={soundEnabled}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "analytics" && <AnalyticsContent tasks={tasks} darkMode={settings.darkMode} selectedDate={selectedDate} />}

        {activeTab === "calendar" && (
          <CalendarContent 
            tasks={tasks} 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            darkMode={settings.darkMode}
            setShowAddModal={setShowAddModal}
            setEditing={setEditing}
          />
        )}
        
        {activeTab === "profile" && (
          <ProfileContent 
            tasks={tasks} 
            darkMode={settings.darkMode} 
            settings={settings}
            toggleAlarmEnabled={toggleAlarmEnabled}
            triggerManualAlarm={triggerManualAlarm}
            snoozeAlarm={snoozeAlarm}
            stopAlarm={stopAlarm}
            soundEnabled={soundEnabled}
            testAlarmSound={testAlarmSound}
            testSound={testSound}
          />
        )}

        {/* Pomodoro Timer */}
        <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm flex items-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              <span className="mr-1">🍅</span>
              Pomodoro Timer
            </div>
            <div className="text-2xs text-gray-500">
              Work: {pomodoro.workSeconds / 60}m • Break: {pomodoro.shortBreak / 60}m • Long: {pomodoro.longBreak / 60}m
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-md font-mono bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 px-2 py-1 rounded text-sm">
              {formatHM(pomodoro.secondsLeft)}
            </div>
            <div className="flex gap-1">
              {!pomodoro.isRunning ? (
                <button 
                  onClick={() => startPomodoro(null)} 
                  className="px-2 py-1 rounded-md bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center text-xs"
                >
                  <Play className="w-3 h-3 mr-0.5" />
                  Start
                </button>
              ) : (
                <button 
                  onClick={() => pausePomodoro()} 
                  className="px-2 py-1 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-white flex items-center text-xs"
                >
                  <Pause className="w-3 h-3 mr-0.5" />
                  Pause
                </button>
              )}
              <button 
                onClick={() => resetPomodoro()} 
                className="px-2 py-1 rounded-md bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center text-xs"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => { setEditing(null); setShowAddModal(true); }} 
        className="fixed bottom-28 right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:shadow-xl transform hover:scale-105 transition-all"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-30 bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="flex items-center justify-around p-1.5">
          {[
            { id: "home", icon: Home, label: "Tasks" },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "calendar", icon: CalendarIcon, label: "Calendar" },
            { id: "profile", icon: User, label: "Profile" }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${isActive ? "scale-105 text-white bg-white bg-opacity-20" : "text-blue-100 hover:text-white"}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-2xs mt-0.5 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <AddTaskForm
          initial={editing}
          onClose={() => { setShowAddModal(false); setEditing(null); }}
          onSave={(data) => addOrUpdateTask(data, editing)}
          selectedDate={selectedDate}
          darkMode={settings.darkMode}
          soundEnabled={soundEnabled}
          testAlarmSound={testAlarmSound}
          testSound={testSound}
        />
      )}
    </div>
  );
};

export default ProductivityApp;