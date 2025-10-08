import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import styled from "styled-components/native";
import Title from "@/components/atoms/Title";
import { RestaurantForm } from "@/components/organisms/RestaurantForm";
import { getRestaurantById, updateRestaurant, Restaurant } from "@/services/restaurant";

export default function RestaurantEditScreen() {
const { restaurantId } = useSearchParams<{ restaurantId: string }>();
  const router = useRouter();
const params = useSearchParams() as { restaurantId: string };
const restaurantId = params.restaurantId;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;

    const loadRestaurant = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantById(restaurantId);
        setRestaurant(data);
      } catch (err) {
        console.error("Erro ao carregar restaurante:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  if (loading && !restaurant) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#038082" />
      </LoadingContainer>
    );
  }

  if (!restaurant) return null; // evita renderizar se não tiver restaurante

  const initialValues = {
    name: restaurant.name,
    tradeName: restaurant.tradeName ?? "",
    cnpj: restaurant.cnpj ?? "",
    inscricaoEstadual: restaurant.inscricaoEstadual ?? "",
    address: {
      street: restaurant.address?.street ?? "",
      houseNumber: restaurant.address?.houseNumber ?? "",
      city: restaurant.address?.city ?? "",
      neighborhood: restaurant.address?.neighborhood ?? "",
    },
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);

      await updateRestaurant(restaurantId!, values);
      router.back();
    } catch (err) {
      console.error("Erro ao atualizar restaurante:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Editar Restaurante</Title>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <RestaurantForm initialValues={initialValues} onSubmit={handleSubmit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #041224;
`;
