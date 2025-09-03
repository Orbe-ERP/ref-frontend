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

const Button = styled.TouchableOpacity`
  background-color: #041224;
  padding: 15px;
  border-radius: 25px;
  align-items: center;
  margin-top: 20px;
  border-width: 1px;
  border-color: #038082;
  shadow-color: #038082;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 5;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
`;

export const UserListTemplate: React.FC<Props> = ({ users, onDelete, onCreateUser }) => (
  <Container>
    {/* <Title>Lista de Usuários</Title> */}
    <UserList users={users} onDelete={onDelete} />
    <Button onPress={onCreateUser}>
      <ButtonText>Adicionar Usuário</ButtonText>
    </Button>
  </Container>
);
