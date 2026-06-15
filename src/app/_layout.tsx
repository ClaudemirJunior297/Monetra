import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccentProvider } from "@/contexts/AccentContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AccentProvider>
        <AuthProvider>
          <TransactionProvider>
            <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </TransactionProvider>
        </AuthProvider>
      </AccentProvider>
    </ThemeProvider>
  );
}
