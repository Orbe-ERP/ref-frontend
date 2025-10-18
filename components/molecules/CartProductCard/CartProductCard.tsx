import ActionIconButton from "@/components/atoms/ActionIconButton";
import Label from "@/components/atoms/Label";
import ObservationCheckbox from "@/components/molecules/ObservationCheckbox";
import React from "react";
import styled from "styled-components/native";

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

interface CartItemCardProps {
  productName: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  observations: string[];
  selectedObservations: string[];
  onToggleObservation: (obs: string) => void;
}

export default function CartItemCard({
  productName,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  observations,
  selectedObservations,
  onToggleObservation,
}: CartItemCardProps) {
  return (
    <Card>
      <Label>{productName}</Label>
      <Label>Quantidade: {quantity}</Label>

      <Row>
        <ActionIconButton icon="remove-outline" onPress={onDecrease} />
        <Label>{quantity}</Label>
        <ActionIconButton icon="add-outline" onPress={onIncrease} />
        <ActionIconButton icon="trash-outline" onPress={onRemove} variant="danger" />
      </Row>

      {observations.length > 0 ? (
        <ObservationCheckbox
          options={observations}
          selected={selectedObservations}
          onToggle={onToggleObservation}
        />
      ) : (
        <Label>Nenhuma observação disponível</Label>
      )}
    </Card>
  );
}

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;
