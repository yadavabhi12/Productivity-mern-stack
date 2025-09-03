import React, { useState } from "react";
import { 
  User, 
  Download, 
  Share2, 
  Bell, 
  Clock, 
  X, 
  CheckCircle, 
  Play, 
  Pause, 
  Settings,
  Edit3,
  Trophy,
  Zap,
  Star,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Crown,
  Award,
  Sparkles
} from "lucide-react";
import { lastNDates, calculateDailyStats } from "../utils/helpers";
import { categories } from "../utils/constants";
import * as api from "../services/api";
import abhi from '../asset/abhi.png'
const ProfileContent = ({ tasks, darkMode, settings, toggleAlarmEnabled, triggerManualAlarm, snoozeAlarm, stopAlarm }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Abhi",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Productivity enthusiast and lifelong learner 🚀"
  });

  const analytics7Days = () => {
    const days = lastNDates(7);
    return days.map((d) => {
      const s = calculateDailyStats(tasks, d, categories);
      return { date: d, productiveHours: s.productiveHours, totalTasks: s.totalTasks, tasksCompleted: s.tasksCompleted, focusScore: s.focusScore };
    });
  };

  const totalCompleted = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = Math.round((totalCompleted / Math.max(totalTasks, 1)) * 100);
  
  const avgProductivity = (() => {
    const arr = lastNDates(7).map((d) => calculateDailyStats(tasks, d, categories).focusScore);
    const sum = arr.reduce((a,b) => a+b, 0);
    return Math.round((sum / arr.length) || 0);
  })();
  
  const bestStreak = (() => {
    const dates = lastNDates(60);
    let best = 0, cur = 0;
    for (let i = 0; i < dates.length; i++) {
      const s = calculateDailyStats(tasks, dates[i], categories).focusScore;
      if (s >= 80) { cur++; best = Math.max(best, cur); } else cur = 0;
    }
    return best || 0;
  })();

  const last7 = analytics7Days();
  const totalProdHours = last7.reduce((s, d) => s + d.productiveHours, 0);
  const utilizationPct = Math.round((totalProdHours / (24 * 7) * 100) * 10) / 10;

  const alarmTasks = tasks
    .filter(t => t.alarmTime)
    .map(t => ({ ...t, alarmISO: `${t.date}T${t.alarmTime}:00` }))
    .sort((a,b) => new Date(a.alarmISO) - new Date(b.alarmISO));

  const computeAchievements = () => {
    const morningCompleted = tasks.filter((t) => t.completed && t.startTime && t.startTime <= "07:00").length;
    const earlyBirdProgress = Math.min(1, morningCompleted / 5);

    const avgUtil = last7.reduce((s, d) => s + d.focusScore, 0) / Math.max(last7.length, 1);
    const productivityProgress = Math.min(1, avgUtil / 80);

    const dates = lastNDates(60);
    let consec = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      const score = calculateDailyStats(tasks, dates[i], categories).focusScore;
      if (score >= 80) consec++; else break;
    }
    const streakProgress = Math.min(1, consec / 30);

    const deepCount = tasks.filter((t) => {
      if (!t.completed || !t.startTime || !t.endTime) return false;
      const start = new Date(`2000-01-01 ${t.startTime}`);
      const end = new Date(`2000-01-01 ${t.endTime}`);
      const minutes = (end - start) / (1000 * 60);
      return (t.category === "Work" || t.category === "Study") && minutes >= 90;
    }).length;
    const focusNinjaProgress = Math.min(1, deepCount / 10);

    return [
      { 
        id: 1, 
        title: "Early Bird", 
        desc: "Complete 5 morning tasks", 
        icon: "🌅", 
        progress: earlyBirdProgress, 
        unlocked: earlyBirdProgress >= 1,
        points: 100 
      },
      { 
        id: 2, 
        title: "Productivity Master", 
        desc: "80% productivity average (7d)", 
        icon: "🏆", 
        progress: productivityProgress, 
        unlocked: productivityProgress >= 1,
        points: 200 
      },
      { 
        id: 3, 
        title: "Streak Champion", 
        desc: "Maintain 30-day streak", 
        icon: "🔥", 
        progress: streakProgress, 
        unlocked: streakProgress >= 1, 
        value: consec,
        points: 300 
      },
      { 
        id: 4, 
        title: "Focus Ninja", 
        desc: "Complete 10 deep sessions", 
        icon: "🥷", 
        progress: focusNinjaProgress, 
        unlocked: focusNinjaProgress >= 1,
        points: 250 
      }
    ];
  };

  const ach = computeAchievements();
  const unlockedCount = ach.filter(a => a.unlocked).length;
  const totalPoints = ach.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const level = Math.floor(totalPoints / 100) + 1;

  const exportData = () => {
    api.downloadExport();
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${userData.name}'s Productivity Profile`,
        text: `Check out my productivity achievements on Productivity Tracker!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log("Profile saved:", userData);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen rounded-xl`}>
      {/* Profile Header */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-t-xl p-6 shadow-sm`}>
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="relative">
            <div className="relative">
             <div className="relative">
  <div 
    style={{ 
      background: `conic-gradient(#6366f1 ${utilizationPct * 1.2}deg, #96a1a1ff ${utilizationPct * 1.6}deg)` 
    }} 
    className="w-24 h-24 rounded-full flex items-center justify-center"
  >
    <div 
      className={`w-20 h-20 ${darkMode ? "bg-gray-900" : "bg-white"} 
        rounded-full flex items-center justify-center border-2 
        ${darkMode ? "border-gray-800" : "border-white"}`}
    >
      <img 
        src={abhi} 
        alt="Profile" 
        className="w-full h-full object-cover rounded-full" 
      />
    </div>
  </div>
</div>

              
              <div className="absolute -bottom-2 -right-2 p-1 bg-white dark:bg-gray-900 rounded-full shadow-lg border-1 border-indigo-400">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{level}</span>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <button className="absolute top-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md">
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                  placeholder="Your Name"
                />
                <textarea
                  value={userData.bio}
                  onChange={(e) => setUserData({...userData, bio: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                  placeholder="Your Bio"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{userData.bio}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-3 sm:mt-0 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm flex items-center"
                  >
                    <Edit3 className="w-4 h-4 mr-1" /> Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="text-xs text-gray-500">Level</div>
                    <div className="text-xl font-bold text-indigo-600">{level}</div>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="text-xs text-gray-500">Points</div>
                    <div className="text-xl font-bold text-yellow-600">{totalPoints}</div>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="text-xs text-gray-500">Completed</div>
                    <div className="text-xl font-bold text-green-600">{totalCompleted}</div>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="text-xs text-gray-500">Streak</div>
                    <div className="text-xl font-bold text-orange-600">{bestStreak}d</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={exportData} 
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" /> Export Data
                  </button>
                  <button 
                    onClick={shareProfile}
                    className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} mt-4 p-4 rounded-xl shadow-sm`}>
        <div className="flex overflow-x-auto scrollbar-hide">
          {["overview", "achievements", "alarms", "stats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg mx-1 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="p-4 space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Weekly Stats */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-sm`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Weekly Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <div className="text-2xl font-bold">{avgProductivity}%</div>
                  <div className="text-sm opacity-90">Productivity</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <div className="text-2xl font-bold">{completionRate}%</div>
                  <div className="text-sm opacity-90">Completion</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                  <div className="text-2xl font-bold">{utilizationPct}%</div>
                  <div className="text-sm opacity-90">Utilization</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <div className="text-2xl font-bold">{totalProdHours}h</div>
                  <div className="text-sm opacity-90">Productive Time</div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-sm`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Recent Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ach.slice(0, 2).map(a => (
                  <div key={a.id} className={`p-4 rounded-xl border-2 ${
                    a.unlocked 
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" 
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{a.icon}</div>
                      {a.unlocked && <Sparkles className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div className="mt-2">
                      <div className={`font-semibold ${a.unlocked ? "text-yellow-800 dark:text-yellow-200" : "text-gray-800 dark:text-white"}`}>
                        {a.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {a.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "achievements" && (
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-sm`}>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              All Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ach.map(a => (
                <div key={a.id} className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  a.unlocked 
                    ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 transform hover:scale-105" 
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{a.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      a.unlocked 
                        ? "bg-yellow-400 text-yellow-900" 
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}>
                      {a.unlocked ? "Unlocked" : "In Progress"}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className={`font-semibold text-lg ${
                      a.unlocked ? "text-yellow-800 dark:text-yellow-200" : "text-gray-800 dark:text-white"
                    }`}>
                      {a.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {a.desc}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(a.progress * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          a.unlocked ? "bg-yellow-400" : "bg-blue-400"
                        }`} 
                        style={{ width: `${Math.round(a.progress * 100)}%` }} 
                      />
                    </div>
                  </div>
                  
                  {a.unlocked && (
                    <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                      +{a.points} points earned!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "alarms" && (
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-sm`}>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Alarm Management
            </h3>

            {alarmTasks.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-lg mb-2">No alarms set</p>
                <p className="text-gray-400">Add alarms to your tasks to get reminders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alarmTasks.map((t) => {
                  const soon = new Date(t.alarmISO);
                  const isPast = new Date() > soon;
                  const isToday = soon.toDateString() === new Date().toDateString();
                  const isTomorrow = new Date(soon.getTime() + 86400000).toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={t._id} className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                      t.ringing 
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20 animate-pulse" 
                        : darkMode 
                          ? "border-gray-700 bg-gray-800 hover:border-gray-600" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            {categories.find(c=>c.name===t.category)?.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-lg mb-1">{t.title}</div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {t.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {t.alarmTime}
                              </span>
                              {isPast && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                  Passed
                                </span>
                              )}
                              {isToday && !isPast && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Today
                                </span>
                              )}
                              {isTomorrow && !isPast && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Tomorrow
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                t.alarmEnabled 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                              }`}>
                                {t.alarmEnabled ? "Enabled" : "Disabled"}
                              </span>
                              {t.ringing && (
                                <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs flex items-center">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                                  Ringing
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button 
                          onClick={() => toggleAlarmEnabled(t._id)} 
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                            t.alarmEnabled 
                              ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" 
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {t.alarmEnabled ? (
                            <>
                              <X className="w-4 h-4 mr-1" /> Disable
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" /> Enable
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => triggerManualAlarm(t._id)} 
                          className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium flex items-center"
                        >
                          <Play className="w-4 h-4 mr-1" /> Test
                        </button>
                        
                        <button 
                          onClick={() => snoozeAlarm(t._id, 5)} 
                          className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm font-medium flex items-center"
                        >
                          <Clock className="w-4 h-4 mr-1" /> Snooze 5m
                        </button>
                        
                        {t.ringing && (
                          <button 
                            onClick={() => stopAlarm(t._id)} 
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium flex items-center"
                          >
                            <Pause className="w-4 h-4 mr-1" /> Stop
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-sm`}>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Detailed Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <h4 className="font-semibold mb-3">Productivity Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Tasks</span>
                    <span className="font-bold">{totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-bold">{totalCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-bold">{completionRate}%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <h4 className="font-semibold mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Avg Productivity</span>
                    <span className="font-bold">{avgProductivity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Streak</span>
                    <span className="font-bold">{bestStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Utilization</span>
                    <span className="font-bold">{utilizationPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;








