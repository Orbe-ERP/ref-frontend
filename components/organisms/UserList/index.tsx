import React from "react";
import { FlatList } from "react-native";
import { UserItem } from "@/components/molecules/UserItem";

interface User {
  id: string;
  name: string;
  role?: string;
}

interface Props {
  users: User[];
  onDelete: (id: string) => void;
}

export const UserList: React.FC<Props> = ({ users, onDelete }) => (
  <FlatList
    data={users}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <UserItem id={item.id} name={item.name} role={item.role} onDelete={onDelete} />
    )}
  />
);
