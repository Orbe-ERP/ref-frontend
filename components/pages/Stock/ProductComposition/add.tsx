import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Text,
} from "react-native";
import Toast from "react-native-toast-message";
import * as S from "./styles";
import Button from "@/components/atoms/Button";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { getStockItems, StockItem } from "@/services/stock";
import { getKitchens, Kitchen } from "@/services/kitchen";
import { addComposition } from "@/services/product-composition";
import type { Unit } from "@/services/stock";

export default function AddComposition() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();
  const { productId } = useLocalSearchParams<{ productId: string }>();

  const [name, setName] = useState("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [stockItemId, setStockItemId] = useState("");
  const [kitchenId, setKitchenId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingKitchens, setIsLoadingKitchens] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const showToast = (type: "success" | "error" | "info", message: string) => {
    Toast.show({
      type,
      text1:
        type === "error"
          ? "Erro"
          : type === "success"
            ? "Sucesso"
            : "Informação",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    if (!selectedRestaurant?.id) return;

    async function loadData() {
      try {
        setIsLoading(true);
        setIsLoadingKitchens(true);

        const [stock, kitchens] = await Promise.all([
          getStockItems(selectedRestaurant.id),
          getKitchens(selectedRestaurant.id),
        ]);

        setStockItems(stock);
        setKitchens(kitchens);

        if (kitchens.length === 1) {
          setKitchenId(kitchens[0].id);
        }
      } catch {
        showToast("error", "Erro ao carregar dados");
      } finally {
        setIsLoading(false);
        setIsLoadingKitchens(false);
      }
    }

    loadData();
  }, [selectedRestaurant]);

  const filteredItems =
    searchTerm.trim() === ""
      ? stockItems
      : stockItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  const selectedStockItem = stockItems.find((i) => i.id === stockItemId);
  const selectedKitchen = kitchens.find((k) => k.id === kitchenId);
  const unit = selectedStockItem?.unit;

  useEffect(() => {
    if (selectedStockItem && !name) {
      setName(selectedStockItem.name);
    }
  }, [selectedStockItem]);

  async function handleSave() {
    if (isSubmitting) return;

    if (!name.trim()) {
      showToast("info", "Informe o nome da composição");
      return;
    }

    if (!kitchenId) {
      showToast("info", "Selecione uma cozinha");
      return;
    }

    if (!stockItemId) {
      showToast("info", "Selecione um ingrediente");
      return;
    }

    if (!quantity.trim()) {
      showToast("info", "Informe a quantidade");
      return;
    }

    const parsedQuantity = parseFloat(quantity.replace(",", "."));
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      showToast("info", "Quantidade inválida");
      return;
    }

    if (!unit) {
      showToast("error", "Ingrediente sem unidade");
      return;
    }

    setIsSubmitting(true);

    try {
      await addComposition({
        name: name.trim(),
        productId,
        stockItemId,
        kitchenId,
        quantity: parsedQuantity,
        unit: unit as Unit,
        restaurantId: selectedRestaurant!.id,
      });

      showToast("success", "Ingrediente adicionado");
      setTimeout(() => router.back(), 800);
    } catch {
      showToast("error", "Erro ao salvar ingrediente");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Adicionar Ingrediente",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: { fontWeight: "600" },
        }}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <S.ScreenContainer>
          <View style={{ marginBottom: 24 }}>
            <S.Label>Cozinha</S.Label>
            {isLoadingKitchens ? (
              <ActivityIndicator />
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Picker
                  selectedValue={kitchenId}
                  onValueChange={setKitchenId}
                  style={{ color: theme.colors.primary }}
                >
                  <Picker.Item label="Selecione a cozinha" value="" />
                  {kitchens.map((k) => (
                    <Picker.Item key={k.id} label={k.name} value={k.id} />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <View style={{ marginBottom: 24 }}>
            <S.Label>Nome da composição</S.Label>
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
              }}
            >
              <TextInput
                style={{ height: 44, color: theme.colors.text.primary }}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Massa, Recheio, Molho especial"
                placeholderTextColor={theme.colors.text.secondary}
              />
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <S.Label>Ingrediente</S.Label>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Picker
                  selectedValue={stockItemId}
                  onValueChange={setStockItemId}
                  style={{ color: theme.colors.primary }}
                >
                  <Picker.Item label="Selecione o ingrediente" value="" />
                  {filteredItems.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <View style={{ marginBottom: 24 }}>
            <S.Label>Quantidade</S.Label>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 44,
                  color: theme.colors.text.primary,
                }}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Ex: 0.5"
                placeholderTextColor={theme.colors.text.secondary}
              />
              {unit && (
                <Text
                  style={{
                    fontWeight: "600",
                    color: theme.colors.text.secondary,
                  }}
                >
                  {unit}
                </Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              label={isSubmitting ? "Salvando..." : "Salvar"}
              onPress={handleSave}
              disabled={isSubmitting}
            />
            <Button
              label="Cancelar"
              onPress={() => router.back()}
              variant="danger"
            />
          </View>
        </S.ScreenContainer>
      </ScrollView>

      <Toast />
    </>
  );
}
