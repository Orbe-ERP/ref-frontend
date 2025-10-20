import React, { useState, useEffect } from "react";
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getCompletedOrdersByTable, Order } from "@/services/order";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";
import Toast from "react-native-toast-message";

export default function ClosedOrdersPage() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useAppTheme();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printing, setPrinting] = useState(false);

  const loadCompletedOrders = async () => {
    try {
      if (!tableId || typeof tableId !== "string")
        throw new Error("ID da mesa não encontrado");

      setError(null);
      const completedOrders = await getCompletedOrdersByTable(tableId);
      setOrders(completedOrders);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao carregar comandas fechadas";
      setError(message);
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (tableId) loadCompletedOrders();
  }, [tableId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCompletedOrders();
  };

  const handlePrintOrder = (order: Order) => {
    router.push({
      pathname: "/print-order",
      params: { identifier: order.identifier },
    });
  };

  const confirmPrint = async () => {
    if (!selectedOrder) return;

    setPrinting(true);
    try {
      await printOrder(selectedOrder);
      Alert.alert("Sucesso", "Comanda enviada para impressão!");
      setShowPrintModal(false);
      setSelectedOrder(null);
    } catch {
      Toast.show({
        type: "error",
        text1: "Falha ao imprimir comanda. Tente novamente.",
      });

      Alert.alert("Erro", "Falha ao imprimir comanda. Tente novamente.");
    } finally {
      setPrinting(false);
    }
  };

  const printOrder = async (order: Order) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log("Imprimindo comanda:", order.id);
        resolve(true);
      }, 1000);
    });

  const calculateOrderTotal = (order: Order) =>
    order.products.reduce((total, product) => {
      const price = product.appliedPrice || product.product.price;
      return total + price * product.quantity;
    }, 0) + (order.additional || 0);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR") +
    " " +
    new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const renderProductItem = ({ item }: { item: Order["products"][0] }) => {
    const price = item.appliedPrice || item.product.price;
    const total = price * item.quantity;

    return (
      <S.ProductItem>
        <S.ProductInfo>
          <S.ProductName>{item.product.name}</S.ProductName>
          <S.ProductQuantity>(x{item.quantity})</S.ProductQuantity>
        </S.ProductInfo>
        <S.ProductPrice>{formatCurrency(total)}</S.ProductPrice>
      </S.ProductItem>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const orderTotal = calculateOrderTotal(item);

    return (
      <S.OrderCard>
        <S.OrderHeader>
          <S.OrderInfoContainer>
            <S.OrderId>Comanda #{item.id.slice(-6)}</S.OrderId>
            <S.OrderDate>{formatDate(item.updatedAt)}</S.OrderDate>
          </S.OrderInfoContainer>
          <S.PrintButton onPress={() => handlePrintOrder(item)}>
            <Ionicons
              name="print-outline"
              size={20}
              color={theme.colors.surface}
            />
          </S.PrintButton>
        </S.OrderHeader>

        <S.OrderInfo>
          <S.OrderText>Mesa: {item.table.name}</S.OrderText>
          <S.OrderText>
            Responsável: {item.responsible || "Não informado"}
          </S.OrderText>
          <S.OrderText>Pagamento: {item.paymentMethod}</S.OrderText>
          {item.additional && (
            <S.OrderText>
              Taxa adicional: {formatCurrency(item.additional)}
            </S.OrderText>
          )}
        </S.OrderInfo>

        <S.ProductsList>
          <FlatList
            data={item.products}
            renderItem={renderProductItem}
            keyExtractor={(product) => product.id}
            scrollEnabled={false}
          />
        </S.ProductsList>

        <S.TotalContainer>
          <S.TotalLabel>Total:</S.TotalLabel>
          <S.TotalValue>{formatCurrency(orderTotal)}</S.TotalValue>
        </S.TotalContainer>
      </S.OrderCard>
    );
  };

  if (loading) {
    return (
      <S.LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </S.LoadingContainer>
    );
  }

  return (
    <S.ScreenContainer>
      <Stack.Screen
        options={{
          title: "Comandas Fechadas",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <S.EmptyState>
            <Ionicons
              name="receipt-outline"
              size={48}
              color={theme.colors.text.secondary}
            />
            <S.EmptyText>
              Nenhuma comanda fechada encontrada{"\n"}para esta mesa.
            </S.EmptyText>
          </S.EmptyState>
        }
        contentContainerStyle={
          orders.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
        }
      />

      {showPrintModal && selectedOrder && (
        <S.ModalOverlay>
          <S.PrintModal>
            <S.ModalTitle>Imprimir Comanda</S.ModalTitle>
            <S.ModalText>
              Deseja imprimir a comanda #{selectedOrder.id.slice(-6)}?
            </S.ModalText>
            <S.ModalText>Mesa: {selectedOrder.table.name}</S.ModalText>
            <S.ModalText>
              Total: {formatCurrency(calculateOrderTotal(selectedOrder))}
            </S.ModalText>

            <S.ModalButtons>
              <S.CancelButton
                onPress={() => {
                  setShowPrintModal(false);
                  setSelectedOrder(null);
                }}
                disabled={printing}
              >
                <S.ButtonText>Cancelar</S.ButtonText>
              </S.CancelButton>

              <S.PrintButtonModal onPress={confirmPrint} disabled={printing}>
                {printing ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.surface}
                  />
                ) : (
                  <S.ButtonText>Imprimir</S.ButtonText>
                )}
              </S.PrintButtonModal>
            </S.ModalButtons>
          </S.PrintModal>
        </S.ModalOverlay>
      )}
    </S.ScreenContainer>
  );
}
