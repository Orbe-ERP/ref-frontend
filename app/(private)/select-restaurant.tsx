import { RestaurantList } from "@/components/organisms/RestaurantList";
import useRestaurant from "@/hooks/useRestaurant";
import { deleteRestaurant, getRestaurants } from "@/services/restaurant";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

 const Container = styled.View`
  flex: 1;
  background-color: #041224;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

 const Subtitle = styled.Text`
  font-size: 20px;
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
`;

export default function SelectRestaurantScreen() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const { selectRestaurant, selectedRestaurant } = useRestaurant();
  const router = useRouter();

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
    return
  };

  const handleDeleteRestaurant = (restaurantId: string) => {
    try {
      deleteRestaurant(restaurantId);
      setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRestaurant = () => {
    router.push("/(private)/create-restaurant");
  };

  return (
    <Container>
      <Subtitle>Restaurantes Disponíveis</Subtitle>
      <RestaurantList
        restaurants={restaurants}
        selectedRestaurant={selectedRestaurant}
        onSelectRestaurant={handleSelectRestaurant}
        onEditRestaurant={handleEditRestaurant}
        onDeleteRestaurant={handleDeleteRestaurant}
        onCreateRestaurant={handleCreateRestaurant}
      />
    </Container>
  );
}
