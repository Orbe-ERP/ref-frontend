import { Stack } from "expo-router";

export default function PrivateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#041224" },
        headerTintColor: "#fff",
      }}
    />
  );
}
