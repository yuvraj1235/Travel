"use client";

import ThemeProviderClient from "./ThemeProviderClient";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProviderClient>{children}</ThemeProviderClient>;
}
