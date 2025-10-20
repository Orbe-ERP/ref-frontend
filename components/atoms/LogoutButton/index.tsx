import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { ButtonContainer } from "./styles";

interface LogoutButtonProps {
  size?: number;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ size = 24 }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useAppTheme();

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

  return (
    <ButtonContainer
      onPress={doLogout}
      disabled={loading}
      accessibilityLabel="Sair"
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.background} />
      ) : (
        <Ionicons
          name="log-out-outline"
          size={size}
          color={theme.colors.text.primary}
        />
      )}
    </ButtonContainer>
  );
};

export default LogoutButton;
