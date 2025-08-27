import React from "react";
import IconButton from "@/components/atoms/IconButton";
import { Container, Info, Name, Role } from "./styles";
import Button from "@/components/atoms/Button";
interface Props {
  id: string;
  name: string;
  role?: string;
  onDelete: (id: string) => void;
}



export const UserItem: React.FC<Props> = ({ id, name, role, onDelete }) => (
  <Container>
    <Info>
      <Name>{name}</Name>
      {role && <Role>{role}</Role>}
    </Info>
    <Button label="Excluir" onPress={() => onDelete(id)} />
  </Container>
);
