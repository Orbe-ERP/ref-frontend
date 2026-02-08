import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as S from "./styles";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import {
  updateComposition,
  deleteComposition,
} from "@/services/product-composition";
import Input from "@/components/atoms/Input";
import Toast from "react-native-toast-message";

export default function EditComposition() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const {
    id,
    name: initialName,
    quantity: initialQuantity,
  } = useLocalSearchParams<{
    id: string;
    name: string;
    quantity: string;
  }>();

  const [name, setName] = useState(initialName ?? "");
  const [quantity, setQuantity] = useState(initialQuantity ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    if (isSubmitting) return;

    const parsedQuantity = Number(quantity.replace(",", "."));
    if (!name || !parsedQuantity || parsedQuantity <= 0) return;

    try {
      setIsSubmitting(true);

      await updateComposition(id, {
        name,
        quantity: parsedQuantity,
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar ingrediente",
        text2: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true);
      await deleteComposition(id);
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao remover ingrediente",
        text2: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar Ingrediente",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: { fontWeight: "600" },
        }}
      />

      <S.ScreenContainer>
        <S.Label>Nome</S.Label>
        <Input value={name} onChangeText={setName} placeholder="Ex: Farinha" />

        <S.Label>Quantidade</S.Label>
        <Input
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Ex: 0.5"
        />

        <Button
          label={isSubmitting ? "Salvando..." : "Salvar alterações"}
          onPress={handleSave}
          disabled={isSubmitting}
        />

        <Button
          label="Remover ingrediente"
          variant="danger"
          onPress={handleDelete}
          disabled={isSubmitting}
        />
      </S.ScreenContainer>
    </>
  );
}
