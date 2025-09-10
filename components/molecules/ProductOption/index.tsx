import React from "react";
import { Ionicons } from "@expo/vector-icons";
import QuantitySelector from "../QuantitySelector";
import { Actions, AddButton, Container, Dot, ProductText, Radio, Row, RowContainer } from "./styles";
import { Text } from "@/components/atoms/Text";

interface Props {
  name: string;
  selected: boolean;
  quantity: number;
  price: any
  onSelect: () => void;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function ProductOption({
  name,
  selected,
  quantity,
  price,
  onSelect,
  onAdd,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <Container>
      <Row>
        <RowContainer>
        <Radio selected={selected} onPress={onSelect}>
          {selected && <Dot />}
        </Radio>
        <ProductText>{name}</ProductText>
        </RowContainer>
        <Text>Unidade: R${price}</Text>
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

