import React from "react";
import { Item } from "./styles";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

interface ObservationItemProps {
  id: string;
  description: string;
  onDelete: (id: string) => void;
}

export default function ObservationItem({ id, description, onDelete }: ObservationItemProps) {
  return (
    <Item >
      <Label>{description}</Label>
      <Button label="Excluir" onPress={() => onDelete(id)} />
    </Item>
  );
}
