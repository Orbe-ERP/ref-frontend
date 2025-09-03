import { UserListTemplate } from "@/components/template/UserListTemplate";
import { deleteUser, getAll, User } from "@/services/user";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

const UserListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const data = await getAll();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Stack.Screen options={{title: "Lista de usuários", }} />
      <UserListTemplate
        users={users}
        onDelete={handleDeleteUser}
        onCreateUser={() => router.navigate("/create-user")}
      />
    </>
  );
};

export default UserListScreen;
