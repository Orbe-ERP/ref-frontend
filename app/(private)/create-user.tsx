import UserForm from "@/components/molecules/UserForm";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { addUserOnAccount } from "@/services/user";
import { Stack, useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";

const CreateUserScreen = () => {

  const router = useRouter()
  const {theme} = useAppTheme()

  const handleCreateUser = async (values: { name: string; email: string; password: string }) => {
    try {
      await addUserOnAccount(values);
      router.navigate("/(tabs)/config");
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro ao criar usuário",
        text2: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Criar Usuário",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <UserForm onSubmit={handleCreateUser} />
    </>
  );
};

export default CreateUserScreen;
