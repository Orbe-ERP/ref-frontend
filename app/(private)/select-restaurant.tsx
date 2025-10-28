import { RestaurantList } from "@/components/organisms/RestaurantList";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useRestaurant from "@/hooks/useRestaurant";
import {
  deleteRestaurant,
  getRestaurants,
  Restaurant,
} from "@/services/restaurant";
import { defineFavoriteRestaurant } from "@/services/user";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
  margin-bottom: 20px;
`;

export default function SelectRestaurantScreen() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const { selectRestaurant, selectedRestaurant } = useRestaurant();
  const router = useRouter();
  const { theme } = useAppTheme(); 

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSelectRestaurant = (restaurant: any) => {
    selectRestaurant(restaurant);
    router.back();
  };

  const handleEditRestaurant = (restaurant: any) => {
    router.push(`/(private)/edit-restaurant?id=${restaurant.id}`);
    return;
  };

  const handleDeleteRestaurant = (restaurantId: string) => {
    try {
      deleteRestaurant(restaurantId);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteRestaurant = (restaurant: Restaurant) => {
    try {
      defineFavoriteRestaurant(restaurant);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant));
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRestaurant = () => {
    router.push("/(private)/create-restaurant");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Selecionar Restaurante",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <Container>
        <Subtitle>Restaurantes Disponíveis</Subtitle>
        <RestaurantList
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={handleSelectRestaurant}
          onEditRestaurant={handleEditRestaurant}
          onFavoriteRestaurant={handleFavoriteRestaurant}
          onDeleteRestaurant={handleDeleteRestaurant}
          onCreateRestaurant={handleCreateRestaurant}
        />
      </Container>
    </>
  );
}
