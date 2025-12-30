import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PlanOverlay() {
  const router = useRouter();

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(4,18,36,0.97)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Ionicons name="lock-closed" size={72} color="#fff" />

      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 16,
        }}
      >
        Restaurante necessário
      </Text>

      <Text
        style={{
          color: "#cbd5e1",
          fontSize: 14,
          marginTop: 8,
          textAlign: "center",
          paddingHorizontal: 32,
        }}
      >
        Crie um selecione um restasurante para acessar todas funcionalidades.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/select-restaurant")}
        style={{
          marginTop: 24,
          paddingVertical: 12,
          paddingHorizontal: 24,
          backgroundColor: "#2BAE66",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Ir para restaurantes
        </Text>
      </TouchableOpacity>
    </View>
  );
}
