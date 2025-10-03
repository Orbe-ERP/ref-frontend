import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { RestaurantCard } from "../../molecules/RestaurantCard";
import { Container, AddButton, AddButtonText } from "./styles";
import { AppIcon } from "../../atoms/Icons";
import { Restaurant } from "@/services/restaurant";

interface Props {
  restaurants: any[];
  selectedRestaurant?: any;
  onSelectRestaurant: (restaurant: any) => void;
  onEditRestaurant: (restaurant: any) => void;
  onDeleteRestaurant: (restaurantId: string) => void;
  onFavoriteRestaurant: (restaurant: Restaurant) => void;
  onCreateRestaurant: () => void;
}

export const RestaurantList: React.FC<Props> = ({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
  onEditRestaurant,
  onDeleteRestaurant,
  onCreateRestaurant,
  onFavoriteRestaurant
}) => {
  const renderItem: ListRenderItem<any> = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      isSelected={selectedRestaurant?.id === item.id}
      onSelect={onSelectRestaurant}
      onFavorite={onFavoriteRestaurant}
      onEdit={onEditRestaurant}
      onDelete={onDeleteRestaurant}
    />
  );

  return (
    <Container>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListFooterComponent={
          <AddButton onPress={onCreateRestaurant}>
            <AppIcon name="add" size={24} />
            <AddButtonText>Criar Restaurante</AddButtonText>
          </AddButton>
        }
      />
    </Container>
  );
};
