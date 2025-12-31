import { RestaurantList } from "@/components/organisms/RestaurantList";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useRestaurant from "@/hooks/useRestaurant";
import { usePermissions } from "@/hooks/usePermissions";
import {
  deleteRestaurant,
  getRestaurants,
  Restaurant,
} from "@/services/restaurant";
import { defineFavoriteRestaurant } from "@/services/user";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
  margin-bottom: 20px;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 12px 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-width: 2;
  border-color: ${({ theme }) => theme.colors.primary};
  border-style: dashed;
`;

const CreateButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 16px;
`;

export default function SelectRestaurantScreen() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const { selectRestaurant, selectedRestaurant } = useRestaurant();
  const { isAdmin } = usePermissions();
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
    router.replace("/(tabs)");
  };

  const handleEditRestaurant = (restaurant: any) => {
    router.push(`/(private)/edit-restaurant?id=${restaurant.id}`);
    return;
  };

  const handleDeleteRestaurant = (restaurantId: string) => {
    try {
      deleteRestaurant(restaurantId);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Restaurante excluído com sucesso",
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível excluir o restaurante",
      });
    }
  };

  const handleFavoriteRestaurant = (restaurant: Restaurant) => {
    try {
      defineFavoriteRestaurant(restaurant);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant));
      router.push("/");
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Restaurante definido como favorito.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao definir restaurante favorito",
        text2: `${error}`,
      });
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

        {isAdmin && (
          <CreateButton onPress={handleCreateRestaurant}>
            <CreateButtonText>+ Criar Novo Restaurante</CreateButtonText>
          </CreateButton>
        )}

        <RestaurantList
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={handleSelectRestaurant}
          onEditRestaurant={isAdmin ? handleEditRestaurant : undefined}
          onFavoriteRestaurant={isAdmin ? handleFavoriteRestaurant : undefined}
          onDeleteRestaurant={isAdmin ? handleDeleteRestaurant : undefined}
          onCreateRestaurant={undefined}
          showActions={isAdmin}
        />
      </Container>
    </>
  );
}
