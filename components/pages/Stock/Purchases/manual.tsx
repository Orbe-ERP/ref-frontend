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
  addItemsToPurchase,
  validatePurchaseItems,
  calculatePurchaseTotal,
  PurchaseItem,
} from "@/services/purchase";

import { getSuppliers, Supplier } from "@/services/supplier";
import { getStockItems, StockItem } from "@/services/stock";

interface ItemForm extends PurchaseItem {
  id: string;
}

export default function ManualPurchaseScreen() {
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  const [supplierId, setSupplierId] = useState<string | undefined>();
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const [items, setItems] = useState<ItemForm[]>([
    { id: Date.now().toString(), stockItemId: "", quantity: 1, unitCost: 0 },
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
      { id: Date.now().toString(), stockItemId: "", quantity: 1, unitCost: 0 },
    ]);
  }

  function removeItem(id: string) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(
    id: string,
    field: keyof PurchaseItem,
    value: number | string
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleCreatePurchase() {
    if (!selectedRestaurant?.id || !supplierId) {
      Toast.show({
        type: "error",
        text1: "Fornecedor obrigatório",
        text2: "Selecione um fornecedor para continuar",
      });
      return;
    }

    try {
      setSaving(true);

      const purchase = await createManualPurchase({
        restaurantId: selectedRestaurant.id,
        supplierId,
        date: dayjs().toISOString(),
      });

      setPurchaseId(purchase.id);

      Toast.show({
        type: "success",
        text1: "Compra criada",
        text2: "Agora adicione os itens",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível criar a compra",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmItems() {
    if (!purchaseId) return;

    const validation = validatePurchaseItems(items);
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
      await addItemsToPurchase(purchaseId, items);

      Toast.show({
        type: "success",
        text1: "Compra registrada com sucesso",
      });

      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao salvar itens",
      });
    } finally {
      setSaving(false);
    }
  }

  const purchaseValidation = validatePurchaseItems(items);

  if (loading) {
    return (
      <S.LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <S.LoadingText>Carregando dados...</S.LoadingText>
      </S.LoadingContainer>
    );
  }

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
          {/* FORNECEDOR */}
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


              <Button
                label="Cadastrar fornecedor"
                variant="secondary"
                onPress={() => router.push("/stock/suppliers/new")}
              />
       

            {!purchaseId && (
              <Button
                label="Criar compra"
                onPress={handleCreatePurchase}
                disabled={saving}
              />
            )}
          </S.FormSection>

          {/* ITENS */}
          {purchaseId && (
            <>
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
                        onValueChange={(v) =>
                          updateItem(item.id, "stockItemId", v)
                        }
                      >
                        <Picker.Item label="Selecione o produto" value="" />
                        {stockItems.map((s) => (
                          <Picker.Item
                            key={s.id}
                            label={s.name}
                            value={s.id}
                          />
                        ))}
                      </Picker>
                    </S.PickerContainer>
                  </S.FormGroup>

                  <S.FormGroup>
                    <S.Label>Quantidade</S.Label>
                    <Input
                      keyboardType="numeric"
                      value={String(item.quantity)}
                      onChangeText={(v) =>
                        updateItem(item.id, "quantity", Number(v))
                      }
                    />
                  </S.FormGroup>

                  <S.FormGroup>
                    <S.Label>Custo unitário</S.Label>
                    <Input
                      keyboardType="decimal-pad"
                      value={String(item.unitCost)}
                      onChangeText={(v) =>
                        updateItem(item.id, "unitCost", Number(v))
                      }
                    />
                  </S.FormGroup>

                  <S.ItemTotal>
                    <S.Label>Total do item</S.Label>
                    <S.ItemTotalValue>
                      R${" "}
                      {(item.quantity * item.unitCost || 0).toFixed(2)}
                    </S.ItemTotalValue>
                  </S.ItemTotal>
                </S.ItemCard>
              ))}

              <Button label="Adicionar item" onPress={addItem} />

              <S.TotalSection>
                <S.TotalLabelLarge>Total da compra</S.TotalLabelLarge>
                <S.TotalLarge>
                  R$ {calculatePurchaseTotal(items).toFixed(2)}
                </S.TotalLarge>
              </S.TotalSection>

              <Button
                label="Confirmar compra"
                onPress={handleConfirmItems}
                disabled={saving || !purchaseValidation.isValid}
              />
            </>
          )}
        </ScrollView>
      </S.ScreenContainer>
    </>
  );
}
