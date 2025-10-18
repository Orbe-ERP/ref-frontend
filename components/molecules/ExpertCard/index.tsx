import React from "react";
import { View } from "react-native";
import IconButton from "@/components/atoms/IconButton";
import { Card, CardLabel } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Table } from "@/services/table";
import { Category } from "@/services/category";
import { Product } from "@/services/product";

interface ExpertCardProps {
  cardType: Table | Category | Product;
  icon: string;
  onPress: () => void;
  onEdit: () => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ cardType, onPress, onEdit, icon = "pencil" }) => (
  <View style={{ position: "relative", width: "45%", aspectRatio: 1,}}>
    <Card onPress={onPress}>
      <Ionicons name="restaurant" size={24} color="white" />
      <CardLabel>{cardType.name}</CardLabel>
    </Card>
    <View style={{ position: "absolute", top: 5, right: 5 }}>
      <IconButton icon={"pencil"} size={18} onPress={onEdit} />
    </View>
  </View>
);

export default ExpertCard;
