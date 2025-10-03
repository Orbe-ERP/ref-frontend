// components/molecules/OrderProductItem.tsx
import React, { useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  product: any;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemove: (id: string) => void;
}

export default function OrderProductItem({ product, onUpdateQuantity, onRemove }: Props) {
  const [quantity, setQuantity] = useState(product.quantity);

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onUpdateQuantity(product.id, newQty);
  };

  const handleDecrease = () => {
    if (quantity <= 1) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    onUpdateQuantity(product.id, newQty);
  };

  return (
    <Container>
      <Info>
        <Name>{product.product.name}</Name>
        <Quantity>Qtd: {quantity}</Quantity>
      </Info>

      <Actions>
        <IconButton onPress={handleDecrease}>
          <Ionicons name="remove-circle-outline" size={22} color="#fff" />
        </IconButton>

        <IconButton onPress={handleIncrease}>
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
        </IconButton>

        <RemoveButton onPress={() => onRemove(product.id)}>
          <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
        </RemoveButton>
      </Actions>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const Info = styled.View``;

const Name = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const Quantity = styled.Text`
  color: #ccc;
  font-size: 14px;
`;

const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconButton = styled.TouchableOpacity`
  margin-left: 8px;
`;

const RemoveButton = styled.TouchableOpacity`
  margin-left: 12px;
`;
