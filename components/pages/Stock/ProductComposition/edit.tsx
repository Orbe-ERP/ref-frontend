import React, { useState } from "react";
import { Alert } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as S from "./styles";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { updateComposition, deleteComposition } from "@/services/product-composition";
import Input from "@/components/atoms/Input";

export default function EditComposition() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const { id, quantity: initialQuantity } = useLocalSearchParams<{
    id: string;
    quantity: string;
  }>();

  const [quantity, setQuantity] = useState(initialQuantity ?? "");

  async function handleSave() {
    try {
      await updateComposition(id, {
        quantity: Number(quantity),
      });
      router.back();
    } catch {
      Alert.alert("Erro", "Erro ao atualizar ingrediente");
    }
  }

  function handleDelete() {
    Alert.alert(
      "Remover ingrediente",
      "Deseja remover este ingrediente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteComposition(id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar Ingrediente",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        <S.Label>Quantidade</S.Label>
        <Input
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Button label="Salvar alterações" onPress={handleSave} />
        <Button label="Remover ingrediente" variant="danger" onPress={handleDelete} />
      </S.ScreenContainer>
    </>
  );
}
