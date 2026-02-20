import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
import { AppTheme, DarkAppTheme, LightAppTheme } from ".";

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  theme: AppTheme;
  loading: boolean;
}

const STORAGE_KEY = "@app_theme";
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setIsDark(saved === "dark");
      } catch (error) {
        console.warn("Erro ao carregar tema:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light").catch((error) =>
        console.warn("Erro ao salvar tema:", error)
      );
    }
  }, [isDark, loading]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = useMemo(() => (isDark ? DarkAppTheme : LightAppTheme), [isDark]);

  if (loading) {
    return null; 
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme, loading }}>

      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used within AppThemeProvider");
  return context;
};