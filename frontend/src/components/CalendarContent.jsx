import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Target, Award, TrendingUp } from "lucide-react";
import { getMonthMatrix, calculateDailyStats } from "../utils/helpers";
import { categories } from "../utils/constants";

const CalendarContent = ({ tasks, selectedDate, setSelectedDate, darkMode, setShowAddModal, setEditing }) => {
  const matrix = getMonthMatrix(selectedDate);
  const dateObj = new Date(selectedDate + "T00:00:00");
  const monthLabel = dateObj.toLocaleString(undefined, { month: "long", year: "numeric" });
  
  // Get current date for highlighting
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const [viewMode, setViewMode] = useState("month"); // month, week, or day

  // Calculate monthly stats
  const monthlyStats = calculateDailyStats(tasks, selectedDate, categories);
  const monthTasks = tasks.filter(t => t.date.startsWith(selectedDate.slice(0, 7)));
  const completedThisMonth = monthTasks.filter(t => t.completed).length;
  const productivityScore = Math.round((completedThisMonth / Math.max(monthTasks.length, 1)) * 100);

  const quickAddTask = (date) => {
    setEditing(null);
    setSelectedDate(date);
    setTimeout(() => setShowAddModal(true), 100);
  };

  return (
    <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-xl p-4 shadow-lg transition-all duration-300`}>
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Calendar Overview
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className={`flex items-center px-3 py-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <Target className="w-4 h-4 mr-1 text-blue-500" />
              <span>{monthTasks.length} tasks this month</span>
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-green-50"}`}>
              <Award className="w-4 h-4 mr-1 text-green-500" />
              <span>{productivityScore}% productivity</span>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {["month", "week", "day"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                viewMode === mode
                  ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
        <button 
          onClick={() => {
            const d = new Date(selectedDate + "T00:00:00"); 
            d.setMonth(d.getMonth() - 1); 
            setSelectedDate(d.toISOString().split("T")[0]);
          }} 
          className="p-2 rounded-full bg-white dark:bg-gray-600 shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-xl font-bold text-center">
          {monthLabel}
        </div>
        
        <button 
          onClick={() => {
            const d = new Date(selectedDate + "T00:00:00"); 
            d.setMonth(d.getMonth() + 1); 
            setSelectedDate(d.toISOString().split("T")[0]);
          }} 
          className="p-2 rounded-full bg-white dark:bg-gray-600 shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-inner">
        <div className="grid grid-cols-7 gap-2 mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div key={day} className="text-center p-2 font-semibold text-sm text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {matrix.map((week, wi) => 
            week.map((day, di) => {
              if (!day) return <div key={`${wi}-${di}-empty`} className="h-20" />;
              
              const iso = day.toISOString().split("T")[0];
              const dayTasks = tasks.filter((t) => t.date === iso);
              const isSelected = iso === selectedDate;
              const isToday = iso === todayFormatted;
              const isCurrentMonth = day.getMonth() === dateObj.getMonth();
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              
              return (
                <div 
                  key={`${wi}-${di}`}
                  className={`relative group h-20 p-1 rounded-lg transition-all duration-200 ${
                    isSelected 
                      ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg transform scale-105" 
                      : isToday 
                        ? "border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                        : isCurrentMonth 
                          ? darkMode 
                            ? "bg-gray-800 hover:bg-gray-700" 
                            : "bg-white hover:bg-gray-50"
                          : darkMode 
                            ? "text-gray-600 bg-gray-900" 
                            : "text-gray-400 bg-gray-100"
                  } ${isWeekend && !isSelected ? 'opacity-90' : ''}`}
                >
                  <button 
                    onClick={() => setSelectedDate(iso)}
                    className="w-full h-full text-left p-1"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${
                          isSelected ? "text-white" : 
                          isToday ? "text-blue-600 dark:text-blue-400" : 
                          isWeekend ? "text-orange-500" : ""
                        }`}>
                          {day.getDate()}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className={`text-xs px-1 rounded ${
                            isSelected 
                              ? "bg-white/20 text-white" 
                              : darkMode 
                                ? "bg-gray-700 text-gray-300" 
                                : "bg-gray-200 text-gray-600"
                          }`}>
                            {dayTasks.length}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 flex items-end">
                        {dayTasks.length > 0 ? (
                          <div className="w-full">
                            <div className="flex flex-wrap gap-1 mb-1">
                              {dayTasks.slice(0, 2).map((task, i) => (
                                <div 
                                  key={task._id || i} 
                                  className={`w-2 h-2 rounded-full ${
                                    task.completed 
                                      ? 'bg-green-400' 
                                      : 'bg-blue-400'
                                  } ${isSelected ? 'ring-1 ring-white' : ''}`}
                                  title={task.title}
                                />
                              ))}
                            </div>
                            {dayTasks.length > 2 && (
                              <div className={`text-xs ${
                                isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                +{dayTasks.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`text-xs ${
                            isSelected ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            No tasks
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => quickAddTask(iso)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600"
                    title="Add task"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stats and Legend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task completion legend */}
        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Task Status Legend
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
              <span>Completed tasks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span>Pending tasks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
              <span>Weekend days</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
              <span>Selected date</span>
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Monthly Progress
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tasks Completion</span>
                <span>{completedThisMonth}/{monthTasks.length}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (completedThisMonth / Math.max(monthTasks.length, 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Productivity Score</span>
                <span>{productivityScore}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${productivityScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button 
            onClick={() => quickAddTask(todayFormatted)}
            className="p-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Add for Today
          </button>
          <button 
            onClick={() => quickAddTask(selectedDate)}
            className="p-3 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            Add for Selected
          </button>
          <button 
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              quickAddTask(tomorrow.toISOString().split('T')[0]);
            }}
            className="p-3 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Add for Tomorrow
          </button>
          <button 
            onClick={() => setSelectedDate(todayFormatted)}
            className="p-3 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Go to Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarContent;


