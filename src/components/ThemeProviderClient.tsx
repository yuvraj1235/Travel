"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeName = "light" | "dark" | "system";

type ThemeContextValue = {
  resolvedTheme: "light" | "dark";
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored === "light" || stored === "dark") setThemeState(stored);
    else setThemeState("system");
  }, []);

  useEffect(() => {
    const apply = (t: ThemeName) => {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolved = t === "system" ? (prefersDark ? "dark" : "light") : t;

      if (resolved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");

      // set color-scheme for browsers
      try {
        document.documentElement.style.colorScheme = resolved;
      } catch (e) {
        // ignore
      }

      setResolvedTheme(resolved as "light" | "dark");
    };

    apply(theme);

    const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply(theme);
    if (mq && mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq && mq.addListener) mq.addListener(onChange as any);

    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener("change", onChange);
      else if (mq && mq.removeListener) mq.removeListener(onChange as any);
    };
  }, [theme]);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    try {
      if (t === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", t);
    } catch (e) {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ resolvedTheme, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProviderClient");
  return {
    resolvedTheme: ctx.resolvedTheme,
    setTheme: ctx.setTheme,
    theme: ctx.theme,
  } as { resolvedTheme: "light" | "dark"; setTheme: (t: ThemeName) => void; theme: ThemeName };
}
