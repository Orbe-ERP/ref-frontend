import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { User, UpdateUser, getUserById, updateUser } from "@/services/user";
import styled from "styled-components/native";
import AccountForm from "@/components/organisms/AccountForm";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "@/theme/colors";

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
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    try {
      setLoading(true);
      const updateData: UpdateUser = {
        id: userId,
        ...(name !== user?.name && { name }),
        ...(email !== user?.email && { email }),
      };
      await updateUser(updateData);
      navigation.back();
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
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
      <Stack.Screen 
        options={{ 
          title: "Editar conta",
          headerStyle: { backgroundColor: COLORS.dark.primary },
          headerTintColor: COLORS.dark.text.primary,
          headerTitleStyle: { color: COLORS.dark.text.primary },
        }}
      />
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#041224",
          paddingVertical: 20,
          paddingHorizontal: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#038082",
        }}
      >
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
      </View>
    </>
  );
}

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #041224;
`;
