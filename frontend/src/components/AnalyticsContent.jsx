import React, { useState } from "react";
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  Brain, 
  TrendingUp, 
  Calendar,
  Award,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  Download,
  Share2
} from "lucide-react";
import StatsCard from "./StatsCard";
import { categories } from "../utils/constants";
import { calculateDailyStats, lastNDates, categoryDistribution } from "../utils/helpers";

const AnalyticsContent = ({ tasks, darkMode, selectedDate }) => {
  const [timeRange, setTimeRange] = useState("7d"); // 7d, 30d, 90d
  const [expandedChart, setExpandedChart] = useState(null);
  
  const getDateRange = () => {
    switch(timeRange) {
      case "30d": return lastNDates(30);
      case "90d": return lastNDates(90);
      default: return lastNDates(7);
    }
  };

  const analyticsData = () => {
    const days = getDateRange();
    return days.map((d) => {
      const s = calculateDailyStats(tasks, d, categories);
      return { 
        date: d, 
        productiveHours: s.productiveHours, 
        totalTasks: s.totalTasks, 
        tasksCompleted: s.tasksCompleted, 
        focusScore: s.focusScore 
      };
    });
  };

  const data = analyticsData();
  const dist = categoryDistribution(tasks, categories);
  const maxProductive = Math.max(...data.map(d => d.productiveHours), 1);
  const totalHours = data.reduce((s, d) => s + d.productiveHours, 0);
  const avgUtil = Math.round((totalHours / (24 * data.length) * 100) * 10) / 10;
  
  const stats = {
    utilizationPercentage: avgUtil,
    productiveHours: Math.round(totalHours * 10) / 10,
    tasksDone: data.reduce((s, d) => s + d.tasksCompleted, 0),
    tasksTotal: data.reduce((s, d) => s + d.totalTasks, 0),
    focusScore: Math.round(data.reduce((s, d) => s + d.focusScore, 0) / data.length)
  };

  // Calculate streaks
  const calculateStreaks = () => {
    const dates = lastNDates(90);
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (let i = dates.length - 1; i >= 0; i--) {
      const score = calculateDailyStats(tasks, dates[i], categories).focusScore;
      if (score >= 70) {
        currentStreak = i === dates.length - 1 ? currentStreak + 1 : 1;
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
        if (i !== dates.length - 1) currentStreak = 0;
      }
    }

    return { currentStreak, bestStreak };
  };

  const { currentStreak, bestStreak } = calculateStreaks();

  const computeAchievements = () => {
    const morningCompleted = tasks.filter((t) => t.completed && t.startTime && t.startTime <= "07:00").length;
    const earlyBirdProgress = Math.min(1, morningCompleted / 5);

    const avgUtil = data.reduce((s, d) => s + d.focusScore, 0) / Math.max(data.length, 1);
    const productivityProgress = Math.min(1, avgUtil / 80);

    const deepCount = tasks.filter((t) => {
      if (!t.completed || !t.startTime || !t.endTime) return false;
      const start = new Date(`2000-01-01 ${t.startTime}`);
      const end = new Date(`2000-01-01 ${t.endTime}`);
      const minutes = (end - start) / (1000 * 60);
      return (t.category === "Work" || t.category === "Study") && minutes >= 90;
    }).length;
    const focusNinjaProgress = Math.min(1, deepCount / 10);

    const consistencyProgress = Math.min(1, bestStreak / 30);

    return [
      { 
        id: 1, 
        title: "Early Bird", 
        desc: "Complete 5 morning tasks", 
        icon: "🌅", 
        progress: earlyBirdProgress, 
        unlocked: earlyBirdProgress >= 1,
        current: morningCompleted,
        target: 5
      },
      { 
        id: 2, 
        title: "Productivity Master", 
        desc: "80% productivity average", 
        icon: "🏆", 
        progress: productivityProgress, 
        unlocked: productivityProgress >= 1,
        current: Math.round(avgUtil),
        target: 80
      },
      { 
        id: 3, 
        title: "Streak Champion", 
        desc: "Maintain 30-day streak", 
        icon: "🔥", 
        progress: consistencyProgress, 
        unlocked: consistencyProgress >= 1,
        current: bestStreak,
        target: 30
      },
      { 
        id: 4, 
        title: "Focus Ninja", 
        desc: "Complete 10 deep sessions", 
        icon: "🥷", 
        progress: focusNinjaProgress, 
        unlocked: focusNinjaProgress >= 1,
        current: deepCount,
        target: 10
      }
    ];
  };

  const achievements = computeAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
            Productivity Analytics
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your performance and achievements
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              darkMode 
                ? "bg-gray-800 border-gray-700 text-white" 
                : "bg-white border-gray-300"
            }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button className={`p-2 rounded-lg border ${
            darkMode 
              ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" 
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}>
            <Download className="w-4 h-4" />
          </button>
          
          <button className={`p-2 rounded-lg border ${
            darkMode 
              ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" 
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}>
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="rounded-xl p-4 shadow-md bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-lg">
                {unlockedCount === achievements.length ? "All Achievements Unlocked! 🎉" : 
                 `You've unlocked ${unlockedCount} of ${achievements.length} achievements`}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {unlockedCount === achievements.length 
                  ? "You're a productivity superstar!" 
                  : "Keep going to unlock more achievements!"}
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-0">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4" />
              <span>{currentStreak} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={<Target className="w-5 h-5" />} 
          title="Utilization" 
          value={`${stats.utilizationPercentage}%`} 
          subtitle={`${timeRange} average`}
          color="text-blue-500" 
          darkMode={darkMode} 
        />
        <StatsCard 
          icon={<Clock className="w-5 h-5" />} 
          title="Productive Hours" 
          value={`${stats.productiveHours}h`} 
          subtitle={`${timeRange} total`}
          color="text-green-500" 
          darkMode={darkMode} 
        />
        <StatsCard 
          icon={<CheckCircle className="w-5 h-5" />} 
          title="Completion Rate" 
          value={`${Math.round((stats.tasksDone / Math.max(stats.tasksTotal, 1)) * 100)}%`} 
          subtitle={`${stats.tasksDone}/${stats.tasksTotal} tasks`}
          color="text-purple-500" 
          darkMode={darkMode} 
        />
        <StatsCard 
          icon={<Brain className="w-5 h-5" />} 
          title="Focus Score" 
          value={`${stats.focusScore}%`} 
          subtitle={`${timeRange} average`}
          color="text-orange-500" 
          darkMode={darkMode} 
        />
      </div>

      {/* Productivity Chart */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Productivity Trend
          </h4>
          <div className="text-sm text-gray-500">{totalHours}h total productive time</div>
        </div>
        <div className="flex items-end gap-1 h-32 mb-4">
          {data.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t bg-gradient-to-b from-blue-400 to-blue-600 transition-all hover:from-blue-500 hover:to-blue-700 cursor-pointer"
                style={{ height: `${Math.max((d.productiveHours / maxProductive) * 100, 5)}%` }}
                title={`${d.productiveHours}h on ${d.date}`}
              />
              <div className="text-[10px] mt-1 text-gray-500">{d.date.substr(5).replace('-', '/')}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Start</span>
          <span>{timeRange} trend</span>
          <span>Recent</span>
        </div>
      </div>

      {/* Category Distribution */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            Time Distribution by Category
          </h4>
          <div className="text-sm text-gray-500">Total tracked hours</div>
        </div>
        <div className="space-y-4">
          {dist.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg">No data yet</div>
              <div className="text-sm">Start tracking tasks to see your time distribution</div>
            </div>
          ) : dist.map((d) => {
            const pct = Math.round((d.hours / Math.max(dist.reduce((s,x)=>s+x.hours,0), 1)) * 100);
            const cat = categories.find(c => c.name === d.category) || { icon: "📝", color: "bg-gray-400" };
            return (
              <div key={d.category} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{d.category}</div>
                    <div className="text-sm text-gray-500">{d.hours}h • {pct}%</div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className={`h-full rounded-full ${cat.color} transition-all duration-500`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </h4>
          <div className="text-sm text-gray-500">{unlockedCount}/{achievements.length} unlocked</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(a => (
            <div key={a.id} className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              a.unlocked 
                ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 transform hover:scale-105" 
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
            }`}>
              <div className="flex items-start justify-between mb-3">
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
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {a.desc}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{a.current}/{a.target}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      a.unlocked ? "bg-yellow-400" : "bg-blue-400"
                    }`} 
                    style={{ width: `${Math.round(a.progress * 100)}%` }} 
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                {Math.round(a.progress * 100)}% complete
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm`}>
          <h4 className="font-semibold mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-500" />
            Current Streak
          </h4>
          <div className="text-3xl font-bold text-center my-4">{currentStreak} days</div>
          <div className="text-sm text-gray-500 text-center">
            {currentStreak > 0 ? "Keep up the good work! 🔥" : "Start a streak today!"}
          </div>
        </div>
        
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow-sm`}>
          <h4 className="font-semibold mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Best Streak
          </h4>
          <div className="text-3xl font-bold text-center my-4">{bestStreak} days</div>
          <div className="text-sm text-gray-500 text-center">
            Your personal best record! 🏆
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContent;











