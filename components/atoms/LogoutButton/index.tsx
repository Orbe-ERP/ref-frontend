import React, { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";

interface LogoutIconProps {
  size?: number;
  color?: string;
  confirm?: boolean;
}

const LogoutIcon: React.FC<LogoutIconProps> = ({
  size = 24,
  color = "#fff",
  confirm = false,
}) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const doLogout = async () => {
    setLoading(true);
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Até logo 👋",
        text2: "Você saiu da sua conta.",
        position: "top",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
      router.replace("/login");
    }
  };

  const handlePress = async () => {
    if (confirm) {
      Alert.alert(
        "Sair",
        "Tem certeza que deseja sair?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sair", style: "destructive", onPress: doLogout },
        ],
        { cancelable: true }
      );
      return;
    }
    await doLogout();
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={loading} accessibilityLabel="Sair">
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Ionicons name="log-out-outline" size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};

export default LogoutIcon;
