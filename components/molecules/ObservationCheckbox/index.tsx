import Label from "@/components/atoms/Label";
import React from "react";
import styled from "styled-components/native";

const Container = styled.View`
  margin-bottom: 12px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const CheckboxItem = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? "#2563EB" : "#334155")};
  border-radius: 6px;
  padding-vertical: 6px;
  padding-horizontal: 10px;
`;

interface ObservationCheckboxProps {
  options: string[];
  selected: string[];
  onToggle: (obs: string) => void;
}

export default function ObservationCheckbox({
  options,
  selected,
  onToggle,
}: ObservationCheckboxProps) {
  return (
    <Container>
      {options.map((obs, idx) => (
        <CheckboxItem
          key={idx}
          selected={selected.includes(obs)}
          onPress={() => onToggle(obs)}
        >
          <Label>{obs}</Label>
        </CheckboxItem>
      ))}
    </Container>
  );
}
