// // AppThemeProvider.tsx
// import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
// import { AppTheme, DarkAppTheme, LightAppTheme } from ".";
// import { AppThemeFonts, TYPOGRAPHY } from "./typography";

// interface ThemeContextProps {
//   isDark: boolean;
//   toggleTheme: () => void;
//   theme: AppTheme;
//   fonts: AppThemeFonts;
//   loading: boolean;
// }

// const STORAGE_KEY = "@app_theme";
// const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isDark, setIsDark] = useState(true);
//   const [loading, setLoading] = useState(true);

//   // Carregar tema do AsyncStorage
//   useEffect(() => {
//     (async () => {
//       try {
//         const saved = await AsyncStorage.getItem(STORAGE_KEY);
//         if (saved !== null) setIsDark(saved === "dark");
//       } catch (error) {
//         console.warn("Erro ao carregar tema:", error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Salvar tema no AsyncStorage
//   useEffect(() => {
//     if (!loading) {
//       AsyncStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light").catch((err) =>
//         console.warn("Erro ao salvar tema:", err)
//       );
//     }
//   }, [isDark, loading]);

//   const toggleTheme = () => setIsDark((prev) => !prev);
//   const theme = useMemo(() => (isDark ? DarkAppTheme : LightAppTheme), [isDark]);

//   return (
//     <ThemeContext.Provider value={{ isDark, toggleTheme, theme, fonts: TYPOGRAPHY, loading }}>
//       <StyledThemeProvider theme={{ ...theme, fonts: TYPOGRAPHY as AppThemeFonts }}>
//         {children}
//       </StyledThemeProvider>
//     </ThemeContext.Provider>
//   );
// };

// // Hook para usar tema
// export const useAppTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("useAppTheme must be used within AppThemeProvider");
//   return context;
// };

// ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
import { AppTheme, DarkAppTheme, LightAppTheme } from ".";
import { AppThemeFonts, TYPOGRAPHY } from "./typography";

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  theme: AppTheme;
  fonts: AppThemeFonts;
  loading: boolean;
}

const STORAGE_KEY = "@app_theme";
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  // Carregar tema do AsyncStorage
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

  // Salvar tema no AsyncStorage
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light").catch((err) =>
        console.warn("Erro ao salvar tema:", err)
      );
    }
  }, [isDark, loading]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = useMemo(() => (isDark ? DarkAppTheme : LightAppTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme, fonts: TYPOGRAPHY, loading }}>
      <StyledThemeProvider theme={theme}> {/* Remova a duplicação aqui */}
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook para usar tema
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used within AppThemeProvider");
  return context;
};