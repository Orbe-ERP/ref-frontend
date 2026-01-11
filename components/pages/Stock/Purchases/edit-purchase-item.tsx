import React, { useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { TextInput, ScrollView } from "react-native";
import Button from "@/components/atoms/Button";
import { usePurchaseImport } from "@/context/PurchaseImportProvider";
import { Picker } from "@react-native-picker/picker"; // instalar: npm i @react-native-picker/picker

import styled from "styled-components/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export enum Unit {
  UNIT = "UNIT",
  GRAM = "GRAM",
  KILOGRAM = "KILOGRAM",
  MILLILITER = "MILLILITER",
  LITER = "LITER",
  PACKAGE = "PACKAGE",
  OTHER = "OTHER",
}

const Container = styled(ScrollView)`
  flex: 1;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 6px;
  text-transform: uppercase;
`;

const Input = styled(TextInput)`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  font-size: 14px;
`;

const ButtonsContainer = styled.View`
  margin-top: 24px;
  flex-direction: column;
  gap: 12px;
`;

export default function EditPurchaseItemScreen() {
  const { itemIndex } = useLocalSearchParams<{ itemIndex: string }>();
  const { items, updateItem } = usePurchaseImport();
  const item = items[Number(itemIndex)];

  const { theme } = useAppTheme();
  const [name, setName] = useState(item.name);
  const [unit, setUnit] = useState(item.unit);
  const [unitCost, setUnitCost] = useState(String(item.unitCost));
  const [quantity, setQuantity] = useState(String(item.quantity));

  function handleSave() {
    updateItem(Number(itemIndex), {
      name,
      unit,
      unitCost: parseFloat(unitCost),
      quantity: parseFloat(quantity),
      needsAttention: false,
    });
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ title: "Editar Item" }} />
      <Container>
        <Label>Nome</Label>
        <Input value={name} onChangeText={setName} placeholder="Nome do item" />

        <Label>Unidade</Label>
        <Picker
          selectedValue={unit}
          onValueChange={(val) => setUnit(val)}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            backgroundColor: theme.colors.surface,
            marginBottom: 16,
          }}
        >
          {Object.entries(Unit).map(([key, value]) => (
            <Picker.Item key={key} label={key} value={value} />
          ))}
        </Picker>
        <Label>Preço Unitário</Label>
        <Input
          value={unitCost}
          onChangeText={setUnitCost}
          keyboardType="numeric"
          placeholder="0.00"
        />

        <Label>Quantidade</Label>
        <Input
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="0"
        />

        <ButtonsContainer>
          <Button label="Salvar" onPress={handleSave} />
          <Button
            label="Cancelar"
            variant="secondary"
            onPress={() => router.back()}
          />
        </ButtonsContainer>
      </Container>
    </>
  );
}
