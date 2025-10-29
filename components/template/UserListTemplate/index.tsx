import Button from "@/components/atoms/Button";
import { UserList } from "@/components/organisms/UserList";
import React from "react";
import styled from "styled-components/native";

interface Props {
  users: { id: string; name: string; role?: string }[];
  onDelete: (id: string) => void;
  onCreateUser: () => void;
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const EmptyMessage = styled.Text`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 16px;
  text-align: center;
  font-style: italic;
  margin-top: 40px;
`;

export const UserListTemplate: React.FC<Props> = ({ users, onDelete, onCreateUser }) => (
  <Container>
     {users.length > 0 ? (
      <UserList users={users} onDelete={onDelete} />
    ) : (
      <EmptyMessage>Nenhum usuário encontrado.</EmptyMessage>
    )}
    <Button label="Adicionar Usuário" onPress={onCreateUser}/>

  </Container>
);
