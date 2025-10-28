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
  id: string;
  name?: string;
  email?: string;
  password?: string;
  currentPassword: string
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
  console.log(data)
  const response = await api.patch<User>("/users/update", data);
  return response.data;
}

export async function defineFavoriteRestaurant(restaurant: Restaurant) {

  try {

      const response = await api.patch<User>(`users/favorite/${restaurant.id}`);

  return response.data;
  } catch (error: any) {
        console.error(
      "Erro ao deletar no service:",
      error.response?.data || error.message
    );
    throw error;
  }

}

export async function deleteUser(id: string) {
  try {
    const response = await api.delete(`/users/${id}`);
    console.log(
      "Usuário deletado com sucesso:",
      response.status,
      response.data
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao deletar no service:",
      error.response?.data || error.message
    );
    throw error;
  }
}
