import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { TransactionProvider } from "@/contexts/TransactionContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </TransactionProvider>
    </AuthProvider>
  );
}
