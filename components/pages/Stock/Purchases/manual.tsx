import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { Stack, router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";

import {
  createManualPurchase,
  validatePurchaseItems,
  calculatePurchaseTotal,
  PurchaseItem,
} from "@/services/purchase";

import { getSuppliers, Supplier } from "@/services/supplier";
import { getStockItems, StockItem } from "@/services/stock";

interface ItemForm {
  id: string;
  stockItemId: string;
  quantity: string;
  unitCost: string;
}

const parseToNumber = (value: string) => {
  if (!value) return 0;
  return Number(value.replace(",", ".")) || 0;
};

export default function ManualPurchaseScreen() {
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  const [supplierId, setSupplierId] = useState<string | undefined>();
  const [invoiceKey, setInvoiceKey] = useState("");

  const [items, setItems] = useState<ItemForm[]>([
    { id: Date.now().toString(), stockItemId: "", quantity: "", unitCost: "" },
  ]);

  useEffect(() => {
    if (!selectedRestaurant?.id) return;
    loadInitialData();
  }, [selectedRestaurant]);

  async function loadInitialData() {
    try {
      setLoading(true);

      const [suppliersData, stockData] = await Promise.all([
        getSuppliers(),
        getStockItems(selectedRestaurant!.id),
      ]);

      setSuppliers(suppliersData);
      setStockItems(stockData);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao carregar dados iniciais",
      });
    } finally {
      setLoading(false);
    }
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        stockItemId: "",
        quantity: "",
        unitCost: "",
      },
    ]);
  }

  function removeItem(id: string) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: string, field: keyof ItemForm, value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  function getValidItems(itemsForm: ItemForm[]): PurchaseItem[] {
    return itemsForm
      .map((i) => ({
        stockItemId: i.stockItemId,
        quantity: parseToNumber(i.quantity),
        unitCost: parseToNumber(i.unitCost),
      }))
      .filter((i) => i.stockItemId && i.quantity > 0 && i.unitCost > 0);
  }

  async function handleConfirmPurchase() {
    if (!selectedRestaurant?.id || !supplierId) {
      Toast.show({
        type: "error",
        text1: "Fornecedor obrigatório",
        text2: "Selecione um fornecedor para continuar",
      });
      return;
    }

    const validItems = getValidItems(items);

    if (validItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Itens obrigatórios",
        text2: "Adicione ao menos um item válido (qtd e valor > 0)",
      });
      return;
    }

    const validation = validatePurchaseItems(validItems);
    if (!validation.isValid) {
      Toast.show({
        type: "error",
        text1: "Itens inválidos",
        text2: validation.errors[0],
      });
      return;
    }

    try {
      setSaving(true);

      await createManualPurchase({
        restaurantId: selectedRestaurant.id,
        supplierId,
        invoiceKey: invoiceKey || undefined,
        issuedAt: dayjs().toISOString(),
        items: validItems,
      });

      Toast.show({
        type: "success",
        text1: "Compra registrada com sucesso",
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível registrar a compra",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <S.LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <S.LoadingText>Carregando dados...</S.LoadingText>
      </S.LoadingContainer>
    );
  }

  const currentTotal = calculatePurchaseTotal(getValidItems(items));

  return (
    <>
      <Stack.Screen
        options={{
          title: "Compra Manual",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        <ScrollView>
          <S.FormSection>
            <S.SectionHeader>
              <S.SectionTitle>Fornecedor</S.SectionTitle>
              <S.HelpText>
                Selecione o fornecedor responsável por esta compra.
              </S.HelpText>
            </S.SectionHeader>

            <S.PickerContainer>
              <Picker
                selectedValue={supplierId}
                onValueChange={(v) => setSupplierId(v)}
              >
                <Picker.Item label="Selecione o fornecedor" value={undefined} />
                {suppliers.map((s) => (
                  <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
              </Picker>
            </S.PickerContainer>

            <S.FormGroup>
              <S.Label>Chave da nota (opcional)</S.Label>
              <Input
                placeholder="Ex: 35240112345678901234550010000000011000000010"
                value={invoiceKey}
                onChangeText={setInvoiceKey}
              />
            </S.FormGroup>

            <Button
              label="Cadastrar fornecedor"
              variant="secondary"
              onPress={() => router.push("/stock/suppliers/new")}
            />
          </S.FormSection>

          <S.SectionTitle>Itens da compra</S.SectionTitle>

          {items.map((item, index) => (
            <S.ItemCard key={item.id}>
              <S.ItemHeader>
                <S.ItemTitle>Item {index + 1}</S.ItemTitle>
                {items.length > 1 && (
                  <Button
                    label="Remover"
                    variant="secondary"
                    onPress={() => removeItem(item.id)}
                  />
                )}
              </S.ItemHeader>

              <S.FormGroup>
                <S.Label>Produto</S.Label>
                <S.PickerContainer>
                  <Picker
                    selectedValue={item.stockItemId}
                    onValueChange={(v) => updateItem(item.id, "stockItemId", v)}
                  >
                    <Picker.Item label="Selecione o produto" value="" />
                    {stockItems.map((s) => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} />
                    ))}
                  </Picker>
                </S.PickerContainer>
                <Button
                  label="Cadastrar Item"
                  variant="secondary"
                  onPress={() =>
                    router.push("/(private)/stock/items/create-stock")
                  }
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>Quantidade</S.Label>
                <Input
                  keyboardType="decimal-pad"
                  placeholder="0,00"
                  value={item.quantity}
                  onChangeText={(v) => {
                    const text = v.replace(/[^0-9,.]/g, "");
                    updateItem(item.id, "quantity", text);
                  }}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>Custo unitário (R$)</S.Label>
                <Input
                  keyboardType="decimal-pad"
                  placeholder="0,00"
                  value={item.unitCost}
                  onChangeText={(v) => {
                    const text = v.replace(/[^0-9,.]/g, "");
                    updateItem(item.id, "unitCost", text);
                  }}
                />
              </S.FormGroup>

              <S.ItemTotal>
                <S.Label>Total do item </S.Label>
                <S.ItemTotalValue>
                  R${" "}
                  {(
                    parseToNumber(item.quantity) * parseToNumber(item.unitCost)
                  ).toFixed(2)}
                </S.ItemTotalValue>
              </S.ItemTotal>
            </S.ItemCard>
          ))}

          <Button label="Adicionar item" onPress={addItem} />

          <S.TotalSection>
            <S.TotalLabelLarge>Total da compra</S.TotalLabelLarge>
            <S.TotalLarge>R$ {currentTotal.toFixed(2)}</S.TotalLarge>
          </S.TotalSection>

          <Button
            label="Confirmar compra"
            onPress={handleConfirmPurchase}
            disabled={saving}
          />
        </ScrollView>
      </S.ScreenContainer>
    </>
  );
}
