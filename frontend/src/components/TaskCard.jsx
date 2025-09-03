import React from "react";
import { CheckCircle, Circle, Play, Pause, Edit3, Trash2, Bell } from "lucide-react";
import { categories, DEFAULT_SNOOZE_MINUTES } from "../utils/constants";
import { formatHM } from "../utils/helpers";

const TaskCard = ({ 
  task, 
  darkMode, 
  toggleComplete, 
  deleteTask, 
  startPomodoro, 
  pausePomodoro, 
  pomodoro, 
  setEditing, 
  setShowAddModal,
  toggleAlarmEnabled,
  triggerManualAlarm,
  snoozeAlarm,
  stopAlarm,
  stopBeep
}) => {
  const attachedPomodoro = pomodoro.attachedTaskId === task._id && pomodoro.isRunning;

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-3 mb-3 shadow-sm border-l-4 ${task.color}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 w-full">
          <button onClick={() => toggleComplete(task)} className="mt-1">
            {task.completed ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6 text-gray-400" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`${task.completed ? "line-through text-gray-500" : darkMode ? "text-white" : "text-gray-800"} font-medium truncate`}>{task.title}</h3>
              {/* <Star className={`w-4 h-4 ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`} /> */}
            </div>

            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>⏰ {task.startTime || "--"} - {task.endTime || "--"} • {categories.find((c) => c.name === task.category)?.icon} {task.category}</p>

            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {task.tags.map((tag, i) => <span key={i} className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">#{tag}</span>)}
              </div>
            )}

            {task.alarmEnabled && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Bell className={`w-4 h-4 ${task.ringing ? "text-red-500" : "text-yellow-500"}`} />
                <span className={task.ringing ? "text-red-600 font-semibold" : darkMode ? "text-gray-300" : "text-gray-700"}>{task.ringing ? "Ringing — " : "Alarm"} {task.alarmTime || "--"}</span>
              </div>
            )}

            {attachedPomodoro && (
              <div className="mt-2 p-2 bg-indigo-50 rounded text-xs text-indigo-700 inline-block">
                🍅 Pomodoro — {formatHM(pomodoro.secondsLeft)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-3 items-end">
          {pomodoro.attachedTaskId === task._id && pomodoro.isRunning ? (
            <button onClick={() => { pausePomodoro(); }} className="p-1 text-red-500"><Pause className="w-4 h-4" /></button>
          ) : (
            <button onClick={() => startPomodoro(task._id)} className="p-1 text-green-500"><Play className="w-4 h-4" /></button>
          )}
          <button onClick={() => { setEditing(task); setShowAddModal(true); }} className="p-1 text-gray-500"><Edit3 className="w-4 h-4" /></button>
          <button onClick={() => deleteTask(task._id)} className="p-1 text-gray-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {task.description && <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{task.description}</p>}

      {task.ringing ? (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-red-700">🔔 Alarm ringing!</div>
            <div className="text-xs text-red-600">Task: {task.title} • {task.alarmTime}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => snoozeAlarm(task._id)} className="px-3 py-1 rounded-lg bg-yellow-100">Snooze</button>
            <button onClick={() => stopAlarm(task._id)} className="px-3 py-1 rounded-lg bg-red-600 text-white">Stop</button>
          </div>
        </div>
      ) : (
        task.alarmEnabled && (
          <div className="mt-3 flex gap-2">
            <button onClick={() => toggleAlarmEnabled(task._id)} className="px-2 py-1 rounded-lg bg-gray-100 text-xs">Disable</button>
            <button onClick={() => triggerManualAlarm(task._id)} className="px-2 py-1 rounded-lg bg-blue-100 text-xs">Test</button>
            <button onClick={() => snoozeAlarm(task._id, DEFAULT_SNOOZE_MINUTES)} className="px-2 py-1 rounded-lg bg-yellow-100 text-xs">Snooze {DEFAULT_SNOOZE_MINUTES}m</button>
          </div>
        )
      )}
    </div>
  );
};

export default TaskCard;