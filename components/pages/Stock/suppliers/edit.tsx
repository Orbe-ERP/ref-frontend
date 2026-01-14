import React, { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { getSupplierById, updateSupplier } from "@/services/supplier";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function EditSupplierScreen() {
  const { theme } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    loadSupplier();
  }, []);

  async function loadSupplier() {
    try {
      setLoading(true);
      const supplier = await getSupplierById(id);

      setName(supplier.name);
      setTaxId(supplier.taxId ?? "");
      setContact(supplier.contact ?? "");
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar o fornecedor",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  }

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

      await updateSupplier(id, {
        name,
        taxId: taxId || undefined,
        contact: contact || undefined,
      });

      Toast.show({
        type: "success",
        text1: "Fornecedor atualizado",
      });

      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível atualizar o fornecedor",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar fornecedor",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        <S.FormGroup>
          <S.Label>Nome *</S.Label>
          <Input value={name} onChangeText={setName} />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Documento</S.Label>
          <Input value={taxId} onChangeText={setTaxId} />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Contato</S.Label>
          <Input value={contact} onChangeText={setContact} />
        </S.FormGroup>

        <S.Actions>
          <Button
            label="Salvar alterações"
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
