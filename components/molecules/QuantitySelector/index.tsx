import React from "react";
import { Text } from "@/components/atoms/Text";
import { CircleButton, QuantityText, Row } from "./styles";

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({ quantity, onIncrease, onDecrease }: Props) {
  return (
    <Row>
      <CircleButton onPress={onDecrease}>
        <Text>-</Text>
      </CircleButton>
      <QuantityText>{quantity}</QuantityText>
      <CircleButton onPress={onIncrease}>
        <Text>+</Text>
      </CircleButton>
    </Row>
  );
}
