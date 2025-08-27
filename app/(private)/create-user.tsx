import React from "react";
import { addUserOnAccount } from "@/services/user";
import UserForm from "@/components/molecules/UserForm";
import { useRouter } from "expo-router";

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

  return <UserForm onSubmit={handleCreateUser} />;
};

export default CreateUserScreen;
