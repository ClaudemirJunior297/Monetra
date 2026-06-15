import { useTheme } from "@/contexts/ThemeContext";
import { useAccent } from "@/contexts/AccentContext";

export function useColors() {
  const { isDark } = useTheme();
  const { accentColor } = useAccent();

  return {
    bg: isDark ? "#0D0D18" : "#F0F0F8",
    card: isDark ? "#1A1A2E" : "#FFFFFF",
    border: isDark ? "#2A2A4A" : "#E0E0F0",
    text: isDark ? "#FFFFFF" : "#111111",
    sub: isDark ? "#888888" : "#666666",
    input: isDark ? "#12121E" : "#F8F8FF",
    primary: accentColor,
    income: "#66BB6A",
    expense: "#ef5350",
    error: "#ef4444",
    success: "#10b981",
  };
}
