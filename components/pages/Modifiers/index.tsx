import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import { useAppTheme } from "@/context/ThemeProvider/theme";
import useRestaurant from "@/hooks/useRestaurant";
import { getStockItems } from "@/services/stock";
import {
  createModifier,
  addModifierToProduct,
  Modifier,
  getModifiersProduct,
  deleteModifier,
} from "@/services/modifier";
import {
  Container,
  Form,
  Input,
  Label,
  Row,

  Card,
  Title,
  Info,
  Empty
} from "./styles";
import Button from "@/components/atoms/Button";
import CustomSwitch from "@/components/atoms/CustomSwitch";
import { StockPicker } from "@/components/atoms/StockItemPicker";

export default function ProductModifiersPage() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const [stockItems, setStockItems] = useState<{ id: string; name: string }[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [priceChange, setPriceChange] = useState("");
  const [stockItemId, setStockItemId] = useState<string | null>(null);
  const [trackStock, setTrackStock] = useState(false);
  const [allowFreeText, setAllowFreeText] = useState(false);
  const [creating, setCreating] = useState(false);

  async function loadStockItems() {
    if (!selectedRestaurant?.id) return;

    try {
      const items = await getStockItems(selectedRestaurant.id);
      setStockItems(items);
    } catch {
      Toast.show({ type: "error", text1: "Erro ao carregar itens de estoque" });
    }
  }

  async function loadModifiers() {
    if (!productId) return;

    try {
      setLoading(true);
      const data = await getModifiersProduct(productId);

      setModifiers(data);
    } catch {
      Toast.show({ type: "error", text1: "Erro ao carregar modifiers" });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Informe o nome do modifier" });
      return;
    }
    if (!selectedRestaurant?.id || !productId) return;

    try {
      setCreating(true);

      const modifier = await createModifier({
        name: name.trim(),
        priceChange: priceChange ? Number(priceChange) : 0,
        stockItemId: trackStock ? stockItemId : null,
        restaurantId: selectedRestaurant.id,
        allowFreeText,
        trackStock
      });

      await addModifierToProduct(
        selectedRestaurant.id,
        productId,
        modifier.id,
        { required: false, limit: null, default: false }
      );

      setName("");
      setPriceChange("");
      setStockItemId(null);
      setTrackStock(false);
      setAllowFreeText(false);

      Toast.show({ type: "success", text1: "Modifier criado" });
      loadModifiers();
    } catch {
      Toast.show({ type: "error", text1: "Erro ao criar modifier" });
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    loadStockItems();
    loadModifiers();
  }, [productId, selectedRestaurant?.id]);

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Modificadores",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary
        }}
      />


<FlatList
  data={modifiers}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ padding: 16 }}
  ListEmptyComponent={() => <Empty>Nenhum modifier cadastrado para este produto.</Empty>}
  ListHeaderComponent={
    <Form>
      <Input
        placeholder="Nome do modifier"
        placeholderTextColor={theme.colors.text.secondary + "80"}
        value={name}
        onChangeText={setName}
      />

      <Input
        placeholder="Preço adicional (ex: 2.50)"
        placeholderTextColor={theme.colors.text.secondary + "80"}
        keyboardType="decimal-pad"
        value={priceChange}
        onChangeText={setPriceChange}
      />

      <StockPicker
        stockItems={stockItems}
        stockItemId={stockItemId}
        setStockItemId={setStockItemId}
      />

      <Row>
        <Label>Alterar estoque</Label>
        <CustomSwitch value={trackStock} onValueChange={setTrackStock} />
      </Row>

      <Row>
        <Label>Permitir texto livre</Label>
        <CustomSwitch value={allowFreeText} onValueChange={setAllowFreeText} />
      </Row>

      <Button
        onPress={handleCreate}
        disabled={creating}
        label={creating ? "Criando..." : "Criar modifier"}
      />
    </Form>
  }
  renderItem={({ item }) => (
    <Card style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View>
        <Title>{item.name}</Title>
        <Info>
          Preço:{" "}
          {item.priceChange.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Info>
        <Info>Estoque: {item.stockItem?.name ?? "Não altera"}</Info>
        <Info>Texto livre: {item.allowFreeText ? "Sim" : "Não"}</Info>
        <Info>Altera estoque: {item.trackStock ? "Sim" : "Não"}</Info>
      </View>

      <Button
        variant="danger"
        label="🗑️"
        onPress={async () => {
          if (!selectedRestaurant?.id || !productId) return;
          try {
            await deleteModifier(item.id);
            setModifiers((prev) => prev.filter((m) => m.id !== item.id));
            Toast.show({ type: "success", text1: "Modifier excluído" });
          } catch {
            Toast.show({ type: "error", text1: "Erro ao excluir modifier" });
          }
        }}
       
      />
    </Card>
  )}
/>


    </Container>
  );
}
