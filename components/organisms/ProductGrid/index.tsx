import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "@/components/molecules/ProductCard";
import { Product } from "@/services/product";
import { AddButton, Grid } from "./styles";
import Label from "@/components/atoms/Label";

interface Props {
  products: Product[];
  onAdd: () => void;
  onEdit: (p: Product) => void;
  onObservations: (p: Product) => void;
}

export default function ProductGrid({ products, onAdd, onEdit, onObservations }: Props) {
  return (
    <Grid>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          name={p.name}
          onEdit={() => onEdit(p)}
          onObservations={() => onObservations(p)}
        />
      ))}

      <AddButton onPress={onAdd}>
        <Ionicons name="add" size={24} color="white" />
        <Label>Produto</Label>
      </AddButton>
    </Grid>
  );
}

