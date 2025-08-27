// components/molecules/ObservationInputRow.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
}

export default function ObservationInputRow({ value, onChangeText, onSave }: Props) {
  return (
    <View style={styles.row}>
      <Input placeholder="Digite a observação" value={value} onChangeText={onChangeText} />
      <Button label="add-circle" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
