import { useState, useEffect } from "react";
import * as api from "../services/api";

export const useSettings = () => {
  const [settings, setSettings] = useState({ darkMode: false });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const s = await api.getSettings();
      setSettings(s || { darkMode: false });
    } catch (e) {
      console.warn("load settings failed", e);
    }
  };

  const saveSettings = async (payload) => {
    try {
      const s = await api.updateSettings(payload);
      setSettings(s);
    } catch (e) {
      console.warn("save settings failed", e);
    }
  };

  return {
    settings,
    setSettings,
    saveSettings
  };
};