import { api } from "./api";
import { Restaurant } from "./restaurant";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  accountId?: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface AddUserOnAccount {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  newPassword?: string;
  currentPassword: string;
}

export async function createUser(data: CreateUser) {
  const response = await api.post<{ id: string }>("/signup", data);
  return response.data;
}

export async function addUserOnAccount(data: AddUserOnAccount) {
  const response = await api.patch<User>("/users/addAccount", data);
  return response.data;
}

export async function getAll() {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function getUserById(id: string) {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function updateUser(data: UpdateUser) {
  try {
    const response = await api.patch<User>("/users/update", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      "Erro ao atualizar usuário: " +
        (error.response?.data?.message || error.message),
    );
  }
}

export async function defineFavoriteRestaurant(restaurant: Restaurant) {
  try {
    const response = await api.patch<User>(`users/favorite/${restaurant.id}`);

    return response.data;
  } catch (error: any) {
    throw new Error("Erro ao definir restaurante favorito");
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await api.delete(`/users/${id}`);

    return response.data;
  } catch (error: any) {
    throw new Error(
      "Erro ao deletar usuário: " +
        (error.response?.data?.message || error.message),
    );
  }
}
