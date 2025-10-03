import React from "react";
import { AppIcon } from "../../atoms/Icons";
import Title from "@/components/atoms/Title";
import { Container, Content, IconsContainer, IconButton } from "./styles";

interface Props {
  restaurant: any;
  isSelected?: boolean;
  onSelect: (restaurant: any) => void;
  onEdit: (restaurant: any) => void;
  onFavorite: (restaurant: any) => void;
  onDelete: (restaurantId: string) => void;
}



export const RestaurantCard: React.FC<Props> = ({ restaurant, isSelected, onSelect, onFavorite, onEdit, onDelete }) =>
  {

     const starIconName = restaurant.defaultRestaurant ? "star" : "star-outline";
  const starColor = restaurant.defaultRestaurant ? "#FFD700" : "#FFFFFF";
  return (
    <Container selected={isSelected} onPress={() => onSelect(restaurant)}>
      <Content>
        <Title>{restaurant.name}</Title>
        {isSelected && <AppIcon name="checkmark-circle" size={24} color="green" />}
      </Content>

      <IconsContainer>
<IconButton onPress={() => onFavorite(restaurant)}>
          <AppIcon name={starIconName} size={18} color={starColor} />
        </IconButton>
        <IconButton onPress={() => onEdit(restaurant)}>
          <AppIcon name="create-outline" size={18} color="#FFFFFF" />
        </IconButton>
        <IconButton onPress={() => onDelete(restaurant.id)}>
          <AppIcon name="trash-outline" size={18} color="#FFFFFF" />
        </IconButton>
      </IconsContainer>
    </Container>
  );
};
