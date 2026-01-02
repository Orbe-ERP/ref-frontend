import React from "react";
import { View } from "react-native";
import IconButton from "@/components/atoms/IconButton";
import { Card, CardLabel, IconContainer } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Table } from "@/services/table";
import { Category } from "@/services/category";
import { Product } from "@/services/product";
import { useAppTheme } from "@/context/ThemeProvider/theme";

interface ExpertCardProps {
  cardType: Table | Category | Product;
  icon?: string;
  onPress: () => void;
  onEdit: () => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ 
  cardType, 
  onPress, 
  onEdit, 
  icon = "restaurant" 
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ position: "relative", width: 120, height: 120 }}>
      <Card onPress={onPress}>
        <IconContainer>
          <Ionicons name={icon as any} size={40} color={theme.colors.primary} />
        </IconContainer>
        <CardLabel>{cardType.name}</CardLabel>
      </Card>
      <View style={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton icon={"pencil"} size={18} onPress={onEdit} />
      </View>
    </View>
  );
};

export default ExpertCard;