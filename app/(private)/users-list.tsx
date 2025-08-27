import React, { useEffect, useState } from "react";
import { getAll, deleteUser, User } from "@/services/user";
import { UserListTemplate } from "@/components/template/UserListTemplate";
import { useRouter } from "expo-router";

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
    <UserListTemplate
      users={users}
      onDelete={handleDeleteUser}
      onCreateUser={() => router.navigate("/create-user")}
    />
  );
};

export default UserListScreen;
