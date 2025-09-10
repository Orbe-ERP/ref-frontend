import React from "react";
import { Ionicons } from "@expo/vector-icons";
import QuantitySelector from "../QuantitySelector";
import { Actions, AddButton, Container, Dot, ProductText, Radio, Row } from "./styles";

interface Props {
  name: string;
  selected: boolean;
  quantity: number;
  onSelect: () => void;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function ProductOption({
  name,
  selected,
  quantity,
  onSelect,
  onAdd,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <Container>
      <Row>
        <Radio selected={selected} onPress={onSelect}>
          {selected && <Dot />}
        </Radio>
        <ProductText>{name}</ProductText>
      </Row>

      {selected && (
        <Actions>
          <QuantitySelector
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
          <AddButton onPress={onAdd}>
            <Ionicons name="cart-outline" size={22} color="white" />
          </AddButton>
        </Actions>
      )}
    </Container>
  );
}

