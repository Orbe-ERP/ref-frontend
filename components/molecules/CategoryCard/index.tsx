import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Label from "@/components/atoms/Label";
import Card from "@/components/atoms/Card";
import { CardButton } from "../ProductCard/styles";
import { EditButton } from "./styles";
import Button from "@/components/atoms/Button";

interface Props {
  name: string;
  onPress: () => void;
  onEdit: () => void;
}

export default function CategoryCard({ name, onPress, onEdit }: Props) {
  return (
    <Card>
      <CardButton onPress={onPress}>
        <Ionicons name="book" size={24} color="white" />
        <Label>{name}</Label>
      </CardButton>
      <EditButton>
        <Button label="Editar" onPress={onEdit} />
      </EditButton>
    </Card>
  );
}
