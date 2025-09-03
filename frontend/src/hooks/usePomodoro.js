import { useState, useRef, useEffect } from "react";

export const usePomodoro = () => {
  const [pomodoro, setPomodoro] = useState({
    workSeconds: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    isRunning: false,
    secondsLeft: 25 * 60,
    phase: "work",
    cycles: 0,
    attachedTaskId: null
  });
  
  const pomodoroIntervalRef = useRef(null);

  useEffect(() => {
    if (pomodoro.isRunning) {
      if (pomodoroIntervalRef.current) clearInterval(pomodoroIntervalRef.current);
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoro((prev) => {
          if (prev.secondsLeft <= 1) {
            const cycles = prev.phase === "work" ? prev.cycles + 1 : prev.cycles;
            const nextPhaseKey = prev.phase === "work" ? ((cycles + 1) % 4 === 0 ? "break-long" : "break") : "work";
            const nextSeconds = nextPhaseKey === "work" ? prev.workSeconds : (nextPhaseKey === "break" ? prev.shortBreak : prev.longBreak);
            return { ...prev, phase: nextPhaseKey === "break-long" ? "break" : nextPhaseKey, secondsLeft: nextSeconds, cycles };
          }
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
    } else {
      if (pomodoroIntervalRef.current) clearInterval(pomodoroIntervalRef.current);
      pomodoroIntervalRef.current = null;
    }
    
    return () => {
      if (pomodoroIntervalRef.current) clearInterval(pomodoroIntervalRef.current);
    };
  }, [pomodoro.isRunning]);

  const startPomodoro = (attachTaskId = null) => {
    setPomodoro((p) => ({ ...p, isRunning: true, attachedTaskId: attachTaskId, phase: "work", secondsLeft: p.workSeconds }));
  };

  const pausePomodoro = () => setPomodoro((p) => ({ ...p, isRunning: false }));
  
  const resetPomodoro = () => setPomodoro((p) => ({ ...p, isRunning: false, secondsLeft: p.workSeconds, phase: "work", cycles: 0, attachedTaskId: null }));

  return {
    pomodoro,
    setPomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro
  };
};