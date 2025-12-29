import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { Stack, useRouter } from "expo-router";
import { UpdateUser, updateUser } from "@/services/user";
import AccountForm from "@/components/organisms/AccountForm";
import useAuth from "@/hooks/useAuth";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import Toast from "react-native-toast-message";

export default function AccountEditScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useAppTheme();
  const navigation = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!currentPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Informe sua senha atual para atualizar os dados.",
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As senhas não coincidem.",
      });
      return;
    }

    try {
      setLoading(true);

      const updateData: UpdateUser = {
        currentPassword,
        ...(name !== user?.name && { name }),
        ...(email !== user?.email && { email }),
        ...(newPassword && { newPassword }),
      };

      await updateUser(updateData);

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Faça login novamente para concluir a atualização.",
      });

      logout();
      navigation.back();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível atualizar os dados.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#038082" />
      </LoadingContainer>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar Conta",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <Container>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <AccountForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSave={handleSave}
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </>
  );
}

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px 15px;
`;
