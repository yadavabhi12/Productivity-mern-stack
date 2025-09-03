import { useRef } from "react";
import { DEFAULT_SNOOZE_MINUTES } from "../utils/constants";
import * as api from "../services/api";

export const useAlarms = (tasks, setTasks) => {
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  const startBeep = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
        try { oscRef.current.disconnect(); } catch {}
        oscRef.current = null;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
    } catch (e) {
      console.warn("audio start failed", e);
    }
  };

  const stopBeep = () => {
    try {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
        try { oscRef.current.disconnect(); } catch {}
        oscRef.current = null;
      }
    } catch (e) {
      console.warn("stop beep failed", e);
    }
  };

  const snoozeAlarm = async (id, minutes = DEFAULT_SNOOZE_MINUTES) => {
    try {
      const now = new Date();
      const future = new Date(now.getTime() + minutes * 60 * 1000);
      const hh = String(future.getHours()).padStart(2, "0");
      const mm = String(future.getMinutes()).padStart(2, "0");
      stopBeep();
      const newDateISO = future.toISOString().split("T")[0];
      const updated = await api.updateTask(id, { alarmTime: `${hh}:${mm}`, alarmEnabled: true, ringing: false, date: newDateISO });
      setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
    } catch (e) {
      console.warn("snooze failed", e);
    }
  };

  const stopAlarm = async (id) => {
    try {
      stopBeep();
      const updated = await api.updateTask(id, { ringing: false, alarmEnabled: false });
      setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
    } catch (e) {
      console.warn("stop alarm failed", e);
    }
  };

  const toggleAlarmEnabled = async (id) => {
    try {
      const t = tasks.find((x) => x._id === id);
      if (!t) return;
      stopBeep();
      const updated = await api.updateTask(id, { alarmEnabled: !t.alarmEnabled, ringing: false });
      setTasks((prev) => prev.map((x) => x._id === updated._id ? updated : x));
    } catch (e) {
      console.warn("toggleAlarmEnabled failed", e);
    }
  };

  const triggerManualAlarm = async (id) => {
    try {
      startBeep();
      const updated = await api.updateTask(id, { alarmEnabled: true, ringing: true });
      setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));
    } catch (e) {
      console.warn("triggerManualAlarm failed", e);
    }
  };

  return {
    startBeep,
    stopBeep,
    snoozeAlarm,
    stopAlarm,
    toggleAlarmEnabled,
    triggerManualAlarm
  };
};