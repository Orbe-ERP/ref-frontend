import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import IconButton from "@/components/atoms/IconButton";
import * as S from "./styles";

import {
  addObservation,
  deleteObservation,
  getObservationsByProduct,
} from "@/services/product";
import Input from "@/components/atoms/Input";
import { Stack, useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function Observation() {
  const { productId } = useLocalSearchParams();
  const [observationText, setObservationText] = useState("");
  const [observations, setObservations] = useState<any>([]);
  const { theme } = useAppTheme();

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const obs = await getObservationsByProduct(productId);
        setObservations(obs);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar as observações.",
          position: "top",
          visibilityTime: 3000,
        });
      }
    };

    if (productId) {
      fetchObservations();
    }
  }, [productId]);

  async function handleSave() {
    const productData = {
      description: observationText,
      productId: productId,
    };

    try {
      await addObservation(productData);
      setObservationText("");
      const updated = await getObservationsByProduct(productId);
      setObservations(updated);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "A observação não pode ser vazia.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  }

  async function handleDelete(observationId: string) {
    try {
      await deleteObservation(observationId);
      const updated = await getObservationsByProduct(productId);
      setObservations(updated);
    } catch {
      console.error("Erro ao Excluir Observação");
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cozinhas",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <S.ScreenContainer>
        <S.InputRow>
          <Input
            placeholder="Digite a observação"
            placeholderTextColor="#94a3b8"
            value={observationText}
            onChangeText={setObservationText}
            style={{ flex: 1, paddingVertical: 6 }}
          />
          <S.AddButtonWrapper>
            <IconButton onPress={handleSave} icon="add">
              <Ionicons name="add-circle" size={28} color="#fff" />
            </IconButton>
          </S.AddButtonWrapper>
        </S.InputRow>

        <FlatList
          data={observations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <S.ObservationItem>
              <S.ObservationText>{item.description}</S.ObservationText>
              <IconButton onPress={() => handleDelete(item.id)} icon="trash">
                <Ionicons name="trash" size={20} color="#dc2626" />
              </IconButton>
            </S.ObservationItem>
          )}
          ListEmptyComponent={
            <S.ListEmptyText>Nenhuma observação adicionada.</S.ListEmptyText>
          }
          style={{ marginTop: 16 }}
        />
      </S.ScreenContainer>
    </>
  );
}
