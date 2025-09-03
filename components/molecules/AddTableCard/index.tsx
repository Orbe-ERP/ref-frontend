import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { AddButton, AddLabel } from "./styles";

interface AddExpertCardProps {
  onPress: () => void;
  label: string
}

const AddExpertCard: React.FC<AddExpertCardProps> = ({ onPress, label}) => (
  <AddButton onPress={onPress}>
    <Ionicons name="add" size={24} color="white" />
    <AddLabel>{label}</AddLabel>
  </AddButton>
);

export default AddExpertCard;
