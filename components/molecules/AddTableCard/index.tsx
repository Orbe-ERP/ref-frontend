import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { AddButton, AddLabel } from "./styles";

interface AddTableCardProps {
  onPress: () => void;
}

const AddTableCard: React.FC<AddTableCardProps> = ({ onPress }) => (
  <AddButton onPress={onPress}>
    <Ionicons name="add" size={24} color="white" />
    <AddLabel>Mesa</AddLabel>
  </AddButton>
);

export default AddTableCard;
