import React, { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/useAuth";
import { Button, ButtonLabel } from "./styles";
import { useRouter } from "expo-router";

interface LogoutButtonProps {
  label?: string;
  confirm?: boolean; // se true, pede confirmação antes de sair
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  label = "Sair",
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
    <Button onPress={handlePress} disabled={loading} accessibilityLabel="Sair">
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ButtonLabel>{label}</ButtonLabel>
      )}
    </Button>
  );
};

export default LogoutButton;
