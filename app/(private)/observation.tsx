import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";
import IconButton from "@/components/atoms/IconButton";

import {
  addObservation,
  deleteObservation,
  getObservationsByProduct,
} from "@/services/product";
import Input from "@/components/atoms/Input";
import { Stack, useLocalSearchParams } from "expo-router";

/** 🔹 Atoms */
const ScreenContainer = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 24px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AddButtonWrapper = styled.View`
  margin-left: 8px;
  height: 44px;
  width: 44px;
  justify-content: center;
  align-items: center;
  margin-top: -18px;
`;

const ObservationItem = styled.View`
  background-color: #1e293b;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ObservationText = styled.Text`
  color: #f8fafc;
  font-size: 16px;
`;

const ListEmptyText = styled.Text`
  text-align: center;
  color: #94a3b8;
  margin-top: 20px;
  font-size: 14px;
`;

export default function ObservationScreen() {
  const { productId } = useLocalSearchParams();
  const [observationText, setObservationText] = useState("");
  const [observations, setObservations] = useState<any>([]);

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
          title: "Observações",
          headerStyle: { 
            backgroundColor: "#041224"
          }, 
        }} 
      />
      <ScreenContainer>
        <InputRow>
          <Input
            placeholder="Digite a observação"
            placeholderTextColor="#94a3b8"
            value={observationText}
            onChangeText={setObservationText}
            style={{ flex: 1, paddingVertical: 6 }}
          />
          <AddButtonWrapper>
            <IconButton onPress={handleSave} icon="add">
              <Ionicons name="add-circle" size={28} color="#fff" />
            </IconButton>
          </AddButtonWrapper>
        </InputRow>

        <FlatList
          data={observations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ObservationItem>
              <ObservationText>{item.description}</ObservationText>
              <IconButton onPress={() => handleDelete(item.id)} icon="trash">
                <Ionicons name="trash" size={20} color="#dc2626" />
              </IconButton>
            </ObservationItem>
          )}
          ListEmptyComponent={
            <ListEmptyText>Nenhuma observação adicionada.</ListEmptyText>
          }
          style={{ marginTop: 16 }}
        />
      </ScreenContainer>
    </>
  );
}
