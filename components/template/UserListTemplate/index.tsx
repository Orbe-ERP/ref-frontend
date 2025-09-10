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
  background-color: #061a35;
  padding: 20px;
`;


export const UserListTemplate: React.FC<Props> = ({ users, onDelete, onCreateUser }) => (
  <Container>
    {/* <Title>Lista de Usuários</Title> */}
    <UserList users={users} onDelete={onDelete} />
    <Button label="Adicionar Usuário" onPress={onCreateUser}>
    </Button>
  </Container>
);
