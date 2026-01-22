import React, { useState } from "react";
import { Stack, router } from "expo-router";
import Toast from "react-native-toast-message";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { createSupplier } from "@/services/supplier";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useRestaurant from "@/hooks/useRestaurant";

export default function NewSupplierScreen() {
  const { theme } = useAppTheme();
  const {selectedRestaurant} = useRestaurant()

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contact, setContact] = useState("");

  async function handleSave() {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Nome obrigatório",
        text2: "Informe o nome do fornecedor",
      });
      return;
    }

    try {
      setSaving(true);

      await createSupplier({
        name,
        taxId: taxId || undefined,
        contact: contact || undefined,
        restaurantId: selectedRestaurant?.id
      });

      Toast.show({
        type: "success",
        text1: "Fornecedor cadastrado",
      });

      router.back();
    } catch(error) {

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível cadastrar o fornecedor",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Novo Fornecedor",
          headerStyle: { backgroundColor: theme.colors.background }, 
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        <S.FormGroup>
          <S.Label>Nome *</S.Label>
          <Input
            placeholder="Ex: Distribuidora ABC"
            value={name}
            onChangeText={setName}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Documento (opcional)</S.Label>
          <Input
            placeholder="CNPJ / CPF"
            value={taxId}
            onChangeText={setTaxId}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Contato (opcional)</S.Label>
          <Input
            placeholder="Telefone ou e-mail"
            value={contact}
            onChangeText={setContact}
          />
        </S.FormGroup>

        <S.Actions>
          <Button
            label="Salvar fornecedor"
            onPress={handleSave}
            disabled={saving}
          />

          <Button
            label="Cancelar"
            variant="secondary"
            onPress={() => router.back()}
          />
        </S.Actions>
      </S.ScreenContainer>
    </>
  );
}
