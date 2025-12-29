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

export default function EditComposition() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const { id, quantity: initialQuantity } = useLocalSearchParams<{
    id: string;
    quantity: string;
  }>();

  const [quantity, setQuantity] = useState(initialQuantity ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    if (isSubmitting) return;

    const parsedQuantity = Number(quantity.replace(",", "."));
    if (!parsedQuantity || parsedQuantity <= 0) return;

    try {
      setIsSubmitting(true);

      await updateComposition(id, {
        quantity: parsedQuantity,
      });

      console.log(id, parsedQuantity);

      router.back();
    } catch (error) {
      console.error("Erro ao atualizar ingrediente", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true);
      console.log(id);
      await deleteComposition(id);
      router.back();
    } catch (error) {
      console.error("Erro ao remover ingrediente", error);
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
