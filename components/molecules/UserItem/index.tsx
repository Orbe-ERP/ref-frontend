import React from "react";
import IconButton from "@/components/atoms/IconButton";
import { Container, Info, Name, Role } from "./styles";

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
    <IconButton icon="trash-outline" onPress={() => onDelete(id)}>
    </IconButton>  </Container>
);
