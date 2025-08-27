import React from "react";
import CategoryCard from "@/components/molecules/CategoryCard";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Label from "@/components/atoms/Label";
import { Grid } from "./styles";

interface Props {
  categories: { id: string; name: string }[];
  onPress: (id: string) => void;
  onEdit: (id: string) => void;
  onAdd: () => void;
}

export default function CategoryGrid({ categories, onPress, onEdit, onAdd }: Props) {
  return (
    <Grid>
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          name={cat.name}
          onPress={() => onPress(cat.id)}
          onEdit={() => onEdit(cat.id)}
        />
      ))}
      <TouchableOpacity style={{ borderWidth: 1, borderColor: "#4B5563", borderStyle: "dashed", width: "45%", aspectRatio: 1, justifyContent: "center", alignItems: "center", borderRadius: 12, marginVertical: 10 }} onPress={onAdd}>
        <Ionicons name="add" size={24} color="white" />
        <Label>Categoria</Label>
      </TouchableOpacity>
    </Grid>
  );
}
