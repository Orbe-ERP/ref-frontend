import UserForm from "@/components/molecules/UserForm";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { addUserOnAccount } from "@/services/user";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const ItemRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 12px;
  margin-vertical: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  margin-bottom: 20px;
`;

const ItemText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  margin-left: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CreateUserScreen = () => {
  const router = useRouter();
  const { theme } = useAppTheme();

  const handleCreateUser = async (values: { name: string; email: string; password: string }) => {
    try {
      await addUserOnAccount(values);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Usuário criado com sucesso!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao criar usuário",
        text2: `${error}`,
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Gerenciar Usuários",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <Container>
        <ItemRow onPress={() => router.push("/users-list")}>
          <Ionicons
            name="list-outline"
            size={22}
            color={theme.colors.primary}
          />
          <ItemText>Listar Usuários</ItemText>
        </ItemRow>

        <SectionTitle>Criar Novo Usuário</SectionTitle>
        <UserForm onSubmit={handleCreateUser} />
      </Container>
    </>
  );
};

export default CreateUserScreen;