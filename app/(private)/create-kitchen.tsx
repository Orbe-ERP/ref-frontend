import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import useRestaurant from "@/hooks/useRestaurant";
import { Stack } from "expo-router";
import AddExpertCard from "@/components/molecules/AddTableCard";
import ExpertCard from "@/components/molecules/ExpertCard";
import ExpertModal from "@/components/organisms/ExpertModal"; 
import {
  Kitchen,
  getKitchens,
  createKitchen,
  patchKitchen,
  deleteKitchen,
} from "@/services/kitchen";

export default function KitchenScreen() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [newKitchenName, setNewKitchenName] = useState("");
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);

  const { selectedRestaurant } = useRestaurant();

  async function fetchKitchens() {
    if (!selectedRestaurant) return;
    try {
      const data = await getKitchens(selectedRestaurant.id);
      setKitchens(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setKitchens([]);
      } else {
        console.error("Erro ao buscar cozinhas:", error);
      }
    }
  }

  useEffect(() => {
    fetchKitchens();
  }, [selectedRestaurant]);

  const handleCreateKitchen = async () => {
    if (!selectedRestaurant) return;
    try {
      const newKitchen = await createKitchen({
        name: newKitchenName,
        restaurantId: selectedRestaurant.id,
      });
      setKitchens((prev) => [...prev, newKitchen]);
      setNewKitchenName("");
      setIsCreateVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateKitchen = async () => {
    if (!selectedKitchen) return;
    try {
      const updated = await patchKitchen({
        id: selectedKitchen.id,
        name: newKitchenName,
      });
      setKitchens((prev) =>
        prev.map((k) => (k.id === updated.id ? updated : k))
      );
      setNewKitchenName("");
      setSelectedKitchen(null);
      setIsEditVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Deletar cozinha
  const handleDeleteKitchen = async () => {
    if (!selectedKitchen) return;
    try {
      setKitchens((prev) => prev.filter((k) => k.id !== selectedKitchen.id));
      await deleteKitchen(selectedKitchen.id);
      setSelectedKitchen(null);
      setIsEditVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#041224", padding: 24 }}>
      <Stack.Screen options={{ title: "Cozinhas" }} />

      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {kitchens.length === 0 ? (
          <Text
            style={{
              color: "white",
              marginTop: 20,
              marginBottom: 20,
              textAlign: "center",
              width: "100%",
            }}
          >
            Nenhuma cozinha encontrada para este restaurante.
          </Text>
        ) : (
          kitchens.map((kitchen) => (
            <ExpertCard
              icon="cube-outline"
              key={kitchen.id}
              cardType={kitchen}
              onPress={() => console.log("Selecionou:", kitchen.name)}
              onEdit={() => {
                setSelectedKitchen(kitchen);
                setNewKitchenName(kitchen.name);
                setIsEditVisible(true);
              }}
            />
          ))
        )}

        <AddExpertCard
          onPress={() => {
            setSelectedKitchen(null);
            setNewKitchenName("");
            setIsCreateVisible(true);
          }}
          label="Criar Cozinha"
        />
      </ScrollView>

      {/* Criar */}
      <ExpertModal
        visible={isCreateVisible}
        title="Nova Cozinha"
        inputPlaceholder="Nome da Cozinha"
        value={newKitchenName}
        onChangeText={setNewKitchenName}
        onClose={() => setIsCreateVisible(false)}
        onConfirm={handleCreateKitchen}
        confirmLabel="Criar Cozinha"
      />

      {/* Editar */}
      <ExpertModal
        visible={isEditVisible}
        title="Editar Cozinha"
        inputPlaceholder="Nome da Cozinha"
        value={newKitchenName}
        onChangeText={setNewKitchenName}
        onClose={() => setIsEditVisible(false)}
        onConfirm={handleUpdateKitchen}
        confirmLabel="Atualizar"
        showDelete
        onDelete={handleDeleteKitchen}
      />
    </View>
  );
}
