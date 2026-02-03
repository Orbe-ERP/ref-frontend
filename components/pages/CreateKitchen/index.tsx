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
import Toast from "react-native-toast-message";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { CardWrapper, Grid, ScreenContainer } from "./styles";
import { useResponsive } from "@/hooks/useResponsive";

const AVAILABLE_COLORS = [
  "#FF5733",
  "#33A1FF",
  "#FF33F1",
  "#A0AEC0",
  "#038082",
  "#4B5563",
  "#FBBF24",
];

export default function KitchenPage() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [newKitchenName, setNewKitchenName] = useState("");
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);
  const [showOnKitchen, setShowOnKitchen] = useState(true);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const { theme } = useAppTheme();
  const { scale, isMobile } = useResponsive();

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
        Toast.show({
          type: "error",
          text1: "Erro ao buscar cozinhas",
          text2: error.message,
        });
        console.error("Erro ao buscar cozinhas:", error);
      }
    }
  }

  useEffect(() => {
    fetchKitchens();
  }, [selectedRestaurant]);

  const handleCreateKitchen = async () => {
    if (!selectedRestaurant) return;
    if (!newKitchenName.trim()) {
      Toast.show({
        type: "error",
        text1: "Nome inválido",
        text2: "O nome da cozinha não pode estar vazio.",
      });
    }
    try {
      const newKitchen = await createKitchen({
        name: newKitchenName,
        showOnKitchen,
        color: selectedColor,
        restaurantId: selectedRestaurant.id,
      });
      setKitchens((prev: any) => [...prev, newKitchen]);
      setNewKitchenName("");
      setShowOnKitchen(true);
      setSelectedColor(AVAILABLE_COLORS[0]);
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
        showOnKitchen,
        color: selectedColor,
      });
      setKitchens((prev: any) =>
        prev.map((k: any) => (k.id === updated.id ? updated : k))
      );
      setNewKitchenName("");
      setSelectedKitchen(null);
      setShowOnKitchen(true);
      setSelectedColor(AVAILABLE_COLORS[0]);
      setIsEditVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteKitchen = async () => {
    if (!selectedKitchen) return;
    try {
      setKitchens((prev) => prev.filter((k) => k.id !== selectedKitchen.id));
      await deleteKitchen(selectedKitchen.id);
      setSelectedKitchen(null);
      setIsEditVisible(false);
      setNewKitchenName("");
      setShowOnKitchen(true);
      setSelectedColor(AVAILABLE_COLORS[0]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: "Cozinhas",
          headerStyle: { backgroundColor: theme.colors.background},
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Grid isMobile={isMobile}>
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
              <CardWrapper key={kitchen.id} isMobile={isMobile}>
                <ExpertCard
                  icon="cube-outline"
                  cardType={kitchen}
                  onPress={() => console.warn(kitchen.name)}
                  onEdit={() => {
                    setSelectedKitchen(kitchen);
                    setNewKitchenName(kitchen.name);
                    setShowOnKitchen(kitchen.showOnKitchen ?? true);
                    setSelectedColor(kitchen.color ?? AVAILABLE_COLORS[0]);
                    setIsEditVisible(true);
                  }}
                />
              </CardWrapper>
            ))
          )}

          <CardWrapper isMobile={isMobile}>
            <AddExpertCard
              onPress={() => {
                setSelectedKitchen(null);
                setNewKitchenName("");
                setShowOnKitchen(true);
                setSelectedColor(AVAILABLE_COLORS[0]);
                setIsCreateVisible(true);
              }}
              label="Criar Cozinha"
            />
          </CardWrapper>
        </Grid>
      </ScrollView>

      <ExpertModal
        visible={isCreateVisible}
        title="Nova Cozinha"
        inputPlaceholder="Nome da Cozinha"
        value={newKitchenName}
        onChangeText={setNewKitchenName}
        onClose={() => setIsCreateVisible(false)}
        onConfirm={handleCreateKitchen}
        confirmLabel="Criar Cozinha"
        showSwitch
        switchLabel="Mostrar na Cozinha?"
        switchValue={showOnKitchen}
        onSwitchChange={setShowOnKitchen}
        showColorPicker
        colors={AVAILABLE_COLORS}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />

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
        showSwitch
        switchLabel="Mostrar na Cozinha?"
        switchValue={showOnKitchen}
        onSwitchChange={setShowOnKitchen}
        showColorPicker
        colors={AVAILABLE_COLORS}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
    </ScreenContainer>
  );
}
