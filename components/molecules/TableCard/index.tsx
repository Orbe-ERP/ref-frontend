import React from "react";
import { View } from "react-native";
import IconButton from "@/components/atoms/IconButton";
import { Card, CardLabel } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Table } from "@/services/table";
import { useAppTheme } from "@/context/ThemeProvider/theme";

interface TableCardProps {
  table: Table;
  onPress: () => void;
  onEdit: () => void;
  showEditButton?: boolean;
}

const TableCard: React.FC<TableCardProps> = ({ table, onPress, onEdit, showEditButton = true }) => {
  const theme = useAppTheme();

  return (
    <View
      style={{
        position: "relative",
        width: 120,
        height: 120,  
      }}
    >
      <Card onPress={onPress} activeOpacity={0.8}>
        <Ionicons
          name="restaurant"
          size={38}
          color={theme.theme.colors.text.accent}
        />
        <CardLabel>{table.name}</CardLabel>
      </Card>
      {showEditButton && (
        <View style={{ position: "absolute", top: 5, right: 5 }}>
          <IconButton icon="pencil" size={18} onPress={onEdit} />
        </View>
      )}
    </View>
  );
};

export default TableCard;
