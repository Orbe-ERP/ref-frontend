// components/organisms/OrderProductList.tsx
import React from "react";
import styled from "styled-components/native";
import OrderProductItem from "@/components/molecules/OrderProductItem";

interface Props {
  products: any[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export default function OrderProductList({ products, onUpdateQuantity, onRemove, onAdd }: Props) {
  return (
    <Container>
      {products.map((p) => (
        <OrderProductItem
          key={p.id}
          product={p}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}

      <AddButton onPress={onAdd}>
        <AddButtonText>+ Adicionar Produto</AddButtonText>
      </AddButton>
    </Container>
  );
}

const Container = styled.View`
  margin-top: 12px;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #029269;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
