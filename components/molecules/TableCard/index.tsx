import React from "react";
import { View } from "react-native";
import IconButton from "@/components/atoms/IconButton";
import { Card, CardLabel } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Table } from "@/services/table";
import { useTheme } from "styled-components/native";
import { useAppTheme } from "@/context/ThemeProvider/theme";

interface TableCardProps {
  table: Table;
  onPress: () => void;
  onEdit: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onPress, onEdit }) => {
  const theme = useAppTheme();

  return (
    <View
      style={{
        position: "relative",
        width: "45%",
        aspectRatio: 1,
      }}
    >
      <Card onPress={onPress}>
        <Ionicons
          name="restaurant"
          size={36}
          color={theme.theme.colors.text.primary}
        />
        <CardLabel>{table.name}</CardLabel>
      </Card>
      <View style={{ position: "absolute", top: 5, right: 5 }}>
        <IconButton icon="pencil" size={18} onPress={onEdit} />
      </View>
    </View>
  );
};

export default TableCard;
