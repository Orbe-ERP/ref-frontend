import UserForm from "@/components/molecules/UserForm";
import { addUserOnAccount } from "@/services/user";
import { Stack, useRouter } from "expo-router";
import React from "react";

const CreateUserScreen = () => {

  const router = useRouter()

  const handleCreateUser = async (values: { name: string; email: string; password: string }) => {
    try {
      await addUserOnAccount(values);
      router.navigate("/users-list");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{title: "Criar usuário", }} />
      <UserForm onSubmit={handleCreateUser} />
    </>
  );
};

export default CreateUserScreen;
