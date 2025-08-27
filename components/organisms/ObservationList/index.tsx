import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ObservationItem from "@/components/molecules/ObservationItem";
import Label from "@/components/atoms/Label";


interface Props {
  observations: { id: string; description: string }[];
  onDelete: (id: string) => void;
}

export default function ObservationList({ observations, onDelete }: Props) {
  return (
    <FlatList
      data={observations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ObservationItem id={item.id} description={item.description} onDelete={onDelete} />
      )}
      ListEmptyComponent={<Label style={styles.empty}>Nenhuma observação adicionada.</Label>}
      style={{ marginTop: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 20,
  },
});
