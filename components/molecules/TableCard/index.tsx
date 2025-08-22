import React from "react";
import { View } from "react-native";
import IconButton from "@/components/atoms/IconButton";
import { Card, CardLabel } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Table } from "@/services/table";

interface TableCardProps {
  table: Table;
  onPress: () => void;
  onEdit: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onPress, onEdit }) => (
  <View style={{ position: "relative", width: "45%", aspectRatio: 1, marginVertical: 10 }}>
    <Card onPress={onPress}>
      <Ionicons name="restaurant" size={24} color="white" />
      <CardLabel>{table.name}</CardLabel>
    </Card>
    <View style={{ position: "absolute", top: 5, right: 5 }}>
      <IconButton icon="pencil" size={18} onPress={onEdit} />
    </View>
  </View>
);

export default TableCard;
