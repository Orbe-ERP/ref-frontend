import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { addObservation, deleteObservation, getObservationsByProduct } from "@/services/product";
import ObservationInputRow from "@/components/molecules/ObservationInputRow";
import ObservationList from "@/components/organisms/ObservationList";

export default function ObservationScreen() {
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const [observationText, setObservationText] = useState("");
  const [observations, setObservations] = useState<any[]>([]);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const obs = await getObservationsByProduct(productId);
        setObservations(obs);
      } catch (error) {
        console.error("Erro ao buscar observações:", error);
      }
    };

    if (productId) {
      fetchObservations();
    }
  }, [productId]);

  async function handleSave() {
    try {
      await addObservation({ description: observationText, productId });
      setObservationText("");
      setObservations(await getObservationsByProduct(productId));
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteObservation(id);
      setObservations(await getObservationsByProduct(productId));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  }

  return (
    <View style={styles.container}>
      <ObservationInputRow value={observationText} onChangeText={setObservationText} onSave={handleSave} />
      <ObservationList observations={observations} onDelete={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041224",
    padding: 24,
  },
});
