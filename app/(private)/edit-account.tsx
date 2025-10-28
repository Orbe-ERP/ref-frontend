import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { User, UpdateUser, getUserById, updateUser } from "@/services/user";
import styled from "styled-components/native";
import AccountForm from "@/components/organisms/AccountForm";
import { Stack, useRouter } from "expo-router";

interface AccountEditScreenProps {
  userId: string;
}

export default function AccountEditScreen({ userId }: AccountEditScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const handleSave = async () => {
    if (!currentPassword) {
      Alert.alert("Erro", "Informe sua senha atual para atualizar os dados.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const updateData: UpdateUser = {
        id: userId,
        currentPassword,
        ...(name !== user?.name && { name }),
        ...(email !== user?.email && { email }),
        ...(newPassword && { newPassword }),
      };

      await updateUser(updateData);
      
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      navigation.back();
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      Alert.alert("Erro", err?.message || "Não foi possível atualizar os dados.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#038082" />
      </LoadingContainer>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Editar Conta" }} />
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
  background-color: #041224;
`;

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 20px 15px;
`;
