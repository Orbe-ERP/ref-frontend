import { UserListTemplate } from "@/components/template/UserListTemplate";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { deleteUser, getAll, User } from "@/services/user";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const UserListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const {theme} = useAppTheme()

  const fetchUsers = async () => {
    try {
      const data = await getAll();
      setUsers(data);
    } catch (error) {
            Toast.show({
              type: "error",
              text1: "Erro",
              text2: "Erro ao buscar usuários",
              position: "top",
              visibilityTime: 3000,
            });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
            Toast.show({
              type: "error",
              text1: "Erro",
              text2: "Erro ao deletar usuário",
              position: "top",
              visibilityTime: 3000,
            });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Usuários",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <UserListTemplate
        users={users}
        onDelete={handleDeleteUser}
        onCreateUser={() => router.navigate("/create-user")}
      />
    </>
  );
};

export default UserListScreen;
