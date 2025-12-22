import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import * as S from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import Title from "@/components/atoms/Title";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import useRestaurant from "@/hooks/useRestaurant";
import {
  createPurchase,
  getPurchases,
  type PurchaseItem as ApiPurchaseItem,
  calculatePurchaseTotal,
  validatePurchaseItems,
  generatePurchaseId,
} from "@/services/purchase";
import { getStockItems, type StockItem } from "@/services/stock";
import { Picker } from "@react-native-picker/picker";

// Interface local para armazenar compras no estado
interface LocalPurchase {
  id: string;
  purchaseId: string;
  total: number;
  itemsCount: number;
  createdAt: string;
}

interface PurchaseItemForm {
  id: string;
  stockItemId: string;
  quantity: string;
  unitCost: string;
}

export default function Purchases() {
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    Toast.show({
      type,
      text1: type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : 'Informação',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const [purchases, setPurchases] = useState<LocalPurchase[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [items, setItems] = useState<PurchaseItemForm[]>([
    { id: Date.now().toString(), stockItemId: "", quantity: "1", unitCost: "0" },
  ]);

  useEffect(() => {
    if (!selectedRestaurant?.id) return;
    loadData();
  }, [selectedRestaurant]);

  async function loadData() {
    if (!selectedRestaurant?.id) return;
    
    try {
      setLoading(true);
      const [purchaseData, stockData] = await Promise.all([
        getPurchases(selectedRestaurant.id),
        getStockItems(selectedRestaurant.id),
      ]);
      
      const localPurchases: LocalPurchase[] = purchaseData.map(p => ({
        id: p.id,
        purchaseId: p.purchaseId,
        total: calculatePurchaseTotal(p.items),
        itemsCount: p.items.length,
        createdAt: p.createdAt,
      }));
      
      setPurchases(localPurchases);
      setStockItems(stockData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showToast('error', "Não foi possível carregar os dados");
      setStockItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { 
        id: Date.now().toString(), 
        stockItemId: "", 
        quantity: "1", 
        unitCost: "0" 
      },
    ]);
  }

  function removeItem(id: string) {
    if (items.length === 1) {
      setItems([{ id: Date.now().toString(), stockItemId: "", quantity: "1", unitCost: "0" }]);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(
    id: string,
    field: keyof PurchaseItemForm,
    value: string
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function getItemTotal(item: PurchaseItemForm): number {
    const q = parseFloat(item.quantity) || 0;
    const c = parseFloat(item.unitCost) || 0;
    return q * c;
  }

  function getPurchaseTotal(): number {
    return items.reduce((sum, item) => sum + getItemTotal(item), 0);
  }

  function validateForm(): boolean {
    const itemsToValidate: ApiPurchaseItem[] = items.map(item => ({
      stockItemId: item.stockItemId,
      quantity: parseFloat(item.quantity) || 0,
      unitCost: parseFloat(item.unitCost) || 0
    }));

    const validation = validatePurchaseItems(itemsToValidate);

    if (!validation.isValid) {
      showToast('error', validation.errors[0]);
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!selectedRestaurant?.id) {
      showToast('error', "Selecione um restaurante primeiro");
      return;
    }
    
    if (!validateForm()) return;

    try {
      setModalLoading(true);

      const purchaseItems: ApiPurchaseItem[] = items.map((item) => ({
        stockItemId: item.stockItemId,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      }));

      await createPurchase(purchaseItems);
      
      const purchaseId = generatePurchaseId();
      const newPurchase: LocalPurchase = {
        id: purchaseId,
        purchaseId,
        total: getPurchaseTotal(),
        itemsCount: items.length,
        createdAt: dayjs().format(),
      };
      
      setPurchases(prev => [newPurchase, ...prev]);

      setShowModal(false);
      resetForm();
      
      showToast('success', "Compra registrada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao registrar compra:", error);
      showToast('error', error.message || "Não foi possível registrar a compra");
    } finally {
      setModalLoading(false);
    }
  }

  function resetForm() {
    setItems([{ id: Date.now().toString(), stockItemId: "", quantity: "1", unitCost: "0" }]);
  }

  function getSelectedStockItem(stockItemId: string): StockItem | undefined {
    return stockItems.find(item => item.id === stockItemId);
  }

  function renderPurchaseItem({ item }: { item: LocalPurchase }) {
    return (
      <S.Card>
        <S.CardHeader>
          <S.ItemName>Compra #{item.purchaseId.slice(-8)}</S.ItemName>
          <S.DateBadge>
            {dayjs(item.createdAt).format("DD/MM/YYYY")}
          </S.DateBadge>
        </S.CardHeader>
        
        <S.ItemInfo>
          <Ionicons name="cube-outline" size={14} color={theme.colors.text.secondary} />
          <S.InfoText>{item.itemsCount} item{item.itemsCount !== 1 ? 'ns' : ''}</S.InfoText>
        </S.ItemInfo>
        
        <S.TotalContainer>
          <S.TotalLabel>Total:</S.TotalLabel>
          <S.Total>R$ {item.total.toFixed(2)}</S.Total>
        </S.TotalContainer>
      </S.Card>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Compras",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        <S.Header>
          <Button 
            label="Nova Compra" 
            onPress={() => setShowModal(true)} 
            icon={<Ionicons name="add-outline" size={18} color="#fff" />}
            disabled={stockItems.length === 0}
          />
          
          {stockItems.length === 0 && (
            <S.HelpText style={{ marginTop: 8, color: theme.colors.feedback.warning }}>
              <Ionicons name="alert-circle-outline" size={14} />
              {" "}Cadastre itens no estoque antes de registrar compras
            </S.HelpText>
          )}
        </S.Header>

        {loading && purchases.length === 0 ? (
          <S.LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <S.LoadingText>Carregando compras...</S.LoadingText>
          </S.LoadingContainer>
        ) : (
          <FlatList
            data={purchases}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <S.EmptyContainer>
                <Ionicons 
                  name="cart-outline" 
                  size={64} 
                  color={theme.colors.text.secondary} 
                />
                <S.EmptyText>Nenhuma compra registrada</S.EmptyText>
                <S.EmptySubtext>
                  {stockItems.length === 0 
                    ? (
                      <>
                        <Ionicons name="cube-outline" size={14} /> 
                        {" "}Cadastre itens no estoque primeiro
                      </>
                    )
                    : (
                      <>
                        <Ionicons name="add-circle-outline" size={14} />
                        {" "}Clique em &apos;Nova Compra&apos; para começar
                      </>
                    )}
                </S.EmptySubtext>
              </S.EmptyContainer>
            }
            ListHeaderComponent={
              purchases.length > 0 ? (
                <S.ListHeader>
                  <S.ListHeaderText>
                    <Ionicons name="list-outline" size={16} />{" "}
                    {purchases.length} compra{purchases.length !== 1 ? 's' : ''} registrada{purchases.length !== 1 ? 's' : ''}
                  </S.ListHeaderText>
                  <S.TotalSummary>
                    <Ionicons name="cash-outline" size={14} />{" "}
                    Total geral: R$ {purchases.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
                  </S.TotalSummary>
                </S.ListHeader>
              ) : null
            }
            renderItem={renderPurchaseItem}
          />
        )}
      </S.ScreenContainer>

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <S.ModalHeader style={{ backgroundColor: theme.colors.background }}>
              <Title style={{ color: theme.colors.text.primary }}>
                <Ionicons name="cart-outline" size={20} /> Nova Compra
              </Title>
              <Button 
                label=""
                icon={<Ionicons name="close-outline" size={20} color={theme.colors.text.primary} />}
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              />
            </S.ModalHeader>

            <S.FormContainer style={{ backgroundColor: theme.colors.background }}>
              <S.SectionTitle style={{ color: theme.colors.text.primary }}>
                <Ionicons name="cube-outline" size={18} /> Itens da Compra *
              </S.SectionTitle>
              <S.HelpText style={{ color: theme.colors.text.secondary, marginBottom: 16 }}>
                <Ionicons name="information-circle-outline" size={12} />
                {" "}Selecione itens cadastrados no estoque
              </S.HelpText>
              
              {items.map((item, index) => {
                const selectedItem = getSelectedStockItem(item.stockItemId);
                
                return (
                  <S.ItemCard 
                    key={item.id}
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border 
                    }}
                  >
                    <S.ItemHeader>
                      <S.ItemTitle style={{ color: theme.colors.text.primary }}>
                        <Ionicons name="pricetag-outline" size={16} /> Item {index + 1}
                      </S.ItemTitle>
                      {items.length > 1 && (
                        <Button
                          label=""
                          icon={<Ionicons name="trash-outline" size={16} color={theme.colors.feedback.error} />}
                          onPress={() => removeItem(item.id)}
                        />
                      )}
                    </S.ItemHeader>

                    <S.FormGroup>
                      <S.Label style={{ color: theme.colors.text.primary }}>
                        <Ionicons name="fast-food-outline" size={14} /> Produto *
                      </S.Label>
                      <S.PickerContainer style={{ borderColor: theme.colors.border }}>
                        <Picker
                          selectedValue={item.stockItemId}
                          onValueChange={(v) => updateItem(item.id, "stockItemId", v)}
                          style={{ 
                            color: theme.colors.text.primary,
                            backgroundColor: theme.colors.background 
                          }}
                          dropdownIconColor={theme.colors.text.primary}
                        >
                          <Picker.Item label="Selecione um produto" value="" />
                          {stockItems.map((stockItem) => (
                            <Picker.Item 
                              key={stockItem.id} 
                              label={`${stockItem.name} (${stockItem.unit || 'un'})`} 
                              value={stockItem.id} 
                            />
                          ))}
                        </Picker>
                      </S.PickerContainer>
                      
                      {selectedItem && (
                        <S.HelpText style={{ color: theme.colors.text.secondary, marginTop: 4 }}>
                          <Ionicons name="stats-chart-outline" size={12} />
                          {" "}Estoque atual: {selectedItem.quantity} {selectedItem.unit || 'un'}
                          {selectedItem.lastCost && (
                            <>
                              {" "}|{" "}
                              <Ionicons name="cash-outline" size={12} />
                              {" "}Último custo: R$ {selectedItem.lastCost.toFixed(2)}
                            </>
                          )}
                        </S.HelpText>
                      )}
                    </S.FormGroup>

                    <S.Row>
                      <S.FormGroup style={{ flex: 1, marginRight: 8 }}>
                        <S.Label style={{ color: theme.colors.text.primary }}>
                          <Ionicons name="scale-outline" size={14} /> Quantidade *
                        </S.Label>
                        <Input
                          placeholder="Ex: 10"
                          keyboardType="decimal-pad"
                          value={item.quantity}
                          onChangeText={(v) => updateItem(item.id, "quantity", v.replace(',', '.'))}
                          style={{ 
                            backgroundColor: theme.colors.background,
                            color: theme.colors.text.primary,
                            borderColor: theme.colors.border 
                          }}
                          placeholderTextColor={theme.colors.text.secondary}
                        />
                        {selectedItem && (
                          <S.HelpText style={{ color: theme.colors.text.secondary }}>
                            <Ionicons name="trending-up-outline" size={12} />
                            {" "}Novo estoque: {(selectedItem.quantity + (parseFloat(item.quantity) || 0))} {selectedItem.unit || 'un'}
                          </S.HelpText>
                        )}
                      </S.FormGroup>

                      <S.FormGroup style={{ flex: 1 }}>
                        <S.Label style={{ color: theme.colors.text.primary }}>
                          <Ionicons name="pricetag-outline" size={14} /> Custo (R$) *
                        </S.Label>
                        <Input
                          placeholder="Ex: 5.50"
                          keyboardType="decimal-pad"
                          value={item.unitCost}
                          onChangeText={(v) => updateItem(item.id, "unitCost", v.replace(',', '.'))}
                          style={{ 
                            backgroundColor: theme.colors.background,
                            color: theme.colors.text.primary,
                            borderColor: theme.colors.border 
                          }}
                          placeholderTextColor={theme.colors.text.secondary}
                        />
                        {selectedItem && selectedItem.lastCost && (
                          <S.HelpText style={{ 
                            color: parseFloat(item.unitCost) > selectedItem.lastCost * 1.1 
                              ? theme.colors.feedback.warning 
                              : theme.colors.text.secondary 
                          }}>
                            {parseFloat(item.unitCost) > selectedItem.lastCost * 1.1 
                              ? (
                                <>
                                  <Ionicons name="warning-outline" size={12} />
                                  {" "}Custo {((parseFloat(item.unitCost) / selectedItem.lastCost - 1) * 100).toFixed(0)}% acima do último
                                </>
                              )
                              : (
                                <>
                                  <Ionicons name="cash-outline" size={12} />
                                  {" "}Último custo: R$ {selectedItem.lastCost.toFixed(2)}
                                </>
                              )}
                          </S.HelpText>
                        )}
                      </S.FormGroup>
                    </S.Row>

                    {item.stockItemId && (
                      <S.ItemTotal>
                        <S.TotalLabel style={{ color: theme.colors.text.secondary }}>
                          <Ionicons name="calculator-outline" size={14} /> Total do item:
                        </S.TotalLabel>
                        <S.ItemTotalValue style={{ color: theme.colors.primary }}>
                          R$ {getItemTotal(item).toFixed(2)}
                        </S.ItemTotalValue>
                      </S.ItemTotal>
                    )}
                  </S.ItemCard>
                );
              })}

              <Button
                label="Adicionar Item"
                onPress={addItem}
                icon={<Ionicons name="add-circle-outline" size={18} color={theme.colors.primary} />}
              />

              <S.TotalSection style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary + '20' 
              }}>
                <S.TotalLabelLarge style={{ color: theme.colors.text.primary }}>
                  <Ionicons name="receipt-outline" size={20} /> Total da Compra:
                </S.TotalLabelLarge>
                <S.TotalLarge style={{ color: theme.colors.primary }}>
                  R$ {getPurchaseTotal().toFixed(2)}
                </S.TotalLarge>
              </S.TotalSection>

              <S.ButtonRow>
                <Button
                  label="Cancelar"
                  onPress={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  icon={<Ionicons name="close-outline" size={16} color={theme.colors.text.secondary} />}
                />
                <Button
                  label={modalLoading ? "Registrando..." : "Registrar Compra"}
                  onPress={handleSubmit}
                  disabled={modalLoading || items.some(item => !item.stockItemId)}
                  icon={modalLoading ? undefined : <Ionicons name="checkmark-outline" size={18} color="#fff" />}
                />
              </S.ButtonRow>
            </S.FormContainer>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}