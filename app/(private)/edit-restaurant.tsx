import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { getRestaurantById, updateRestaurant, Restaurant } from "@/services/restaurant";
import styled from "styled-components/native";
import {RestaurantForm} from "@/components/organisms/RestaurantForm";

import { useRouter } from "expo-router";
import Title from "@/components/atoms/Title";

interface RestaurantEditScreenProps {
  restaurantId: string;
}

export default function RestaurantEditScreen({ restaurantId }: RestaurantEditScreenProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [name, setName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useRouter();

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setLoading(true);
        const restaurantData = await getRestaurantById(restaurantId);
        setRestaurant(restaurantData);
        setName(restaurantData.name);
        setTradeName(restaurantData.tradeName ?? "");
        setCnpj(restaurantData.cnpj ?? "");
      } catch (err) {
        console.error("Erro ao carregar restaurante:", err);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurant();
  }, [restaurantId]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const updateData: Partial<Restaurant> = {
        ...(name !== restaurant?.name && { name }),
        ...(tradeName !== restaurant?.tradeName && { tradeName }),
        ...(cnpj !== restaurant?.cnpj && { cnpj }),
      };

      await updateRestaurant(restaurantId, updateData);
      navigation.back();
    } catch (err) {
      console.error("Erro ao atualizar restaurante:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !restaurant) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#038082" />
      </LoadingContainer>
    );
  }

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#041224",
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#038082",
      }}
    >
      <Title>Editar Restaurante</Title>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
<RestaurantForm
  initialValues={{
    name: restaurant?.name ?? "",
    tradeName: restaurant?.tradeName ?? "",
    cnpj: restaurant?.cnpj ?? "",
  }}
  onSubmit={async (values) => {
    try {
      setLoading(true);
      await updateRestaurant(restaurantId, values);
      navigation.back();
    } catch (err) {
      console.error("Erro ao atualizar restaurante:", err);
    } finally {
      setLoading(false);
    }
  }}
  loading={loading}
/>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #041224;
`;
