import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { AddButton, AddLabel } from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";

interface AddExpertCardProps {
  onPress: () => void;
  label: string;
}

const AddExpertCard: React.FC<AddExpertCardProps> = ({ onPress, label }) => {
  const theme = useAppTheme();

  return (
    <AddButton onPress={onPress}>
      <Ionicons name="add" size={40} color={theme.theme.colors.primary} />
      <AddLabel>{label}</AddLabel>
    </AddButton>
  );
};

export default AddExpertCard;
