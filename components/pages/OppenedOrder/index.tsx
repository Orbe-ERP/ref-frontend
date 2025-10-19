import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, Dimensions, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Checkbox } from "react-native-paper";
import { getOrders, Order, concludeOrders } from "@/services/order";
import useRestaurant from "@/hooks/useRestaurant";
import Toast from "react-native-toast-message";
import {
  getPaymentConfigs,
  PaymentConfig,
  CardBrandLabels,
} from "@/services/payment";
import * as S from "./styles";
import { TopBar } from "@/components/atoms/TopBar";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function OppenedOrderPage() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additional, setAdditional] = useState<number>(10);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const theme = useAppTheme();

  const fetchOrders = async () => {
    try {
      const data = await getOrders(tableId as string);
      setOrders(data);
    } catch {
      setError("Erro ao carregar os pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tableId) fetchOrders();
  }, [tableId]);

  useEffect(() => {
    async function loadConfigs() {
      if (selectedRestaurant?.id) {
        const configs = await getPaymentConfigs(selectedRestaurant.id);
        setPaymentConfigs(configs);
      }
    }
    loadConfigs();
  }, [selectedRestaurant?.id]);

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handlePaymentMethodSelect = (orderId: string, method: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentMethod: method,
              cardBrand: method.includes("CARD") ? o.cardBrand : undefined,
            }
          : o
      )
    );
  };

  const handleCardBrandSelect = (orderId: string, brand: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? { ...o, cardBrand: o.cardBrand === brand ? undefined : brand }
          : o
      )
    );
  };

  const handleConcludeSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      Alert.alert("Aviso", "Selecione pelo menos uma comanda para concluir.");
      return;
    }

    try {
      for (const orderId of selectedOrders) {
        const o = orders.find((ord) => ord.id === orderId);
        if (!o?.paymentMethod) {
          Toast.show({
            type: "error",
            text1: "Selecione o método de pagamento",
            text2:
              "Selecione o método de pagamento em todas as comandas selecionadas.",
          });
          return;
        }
      }

      const firstOrder = orders.find((o) => o.id === selectedOrders[0])!;
      const isCard = firstOrder.paymentMethod.includes("CARD");
      const paymentConfigId = isCard
        ? paymentConfigs.find(
            (c) =>
              c.method === firstOrder.paymentMethod &&
              c.brand === firstOrder.cardBrand
          )?.id ?? null
        : null;

      const payload = {
        ordersArray: selectedOrders,
        restaurantId: selectedRestaurant?.id!,
        sumIndividually: false,
        tableId,
        additional,
        paymentMethod: firstOrder.paymentMethod,
        paymentConfigId,
      };

      const response = await concludeOrders(payload);

      setSelectedOrders([]);
      setIsModalVisible(false);
      await fetchOrders();

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Comandas concluídas com sucesso!",
      });

      router.push({
        pathname: "/(private)/print-order",
        params: { identifier: response.orderIdentifier },
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro ao concluir comandas",
        text2: "Não foi possível concluir as comandas selecionadas.",
      });
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "WAITING_DELIVERY":
        return "Esperando Entrega";
      case "PREPARING":
        return "Preparando Pedido";
      case "PENDING":
        return "Pendente";
      case "COMPLETED":
        return "Concluído";
      case "CANCELED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const handleAdditional = (value: number) => {
    if (isNaN(value) || value <= 0) setAdditional(0);
    else if (value > 100) setAdditional(100);
    else setAdditional(value);
  };

  return (
    <S.Container>
      <Stack.Screen
        options={{
          title: "Comandas Abertas",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
        }}
      />

      <TopBar ordersCount={orders.length} />
      {loading && <S.LoadingText>Carregando pedidos...</S.LoadingText>}
      {error && <S.ErrorText>{error}</S.ErrorText>}
      {!loading && !error && orders.length === 0 && (
        <S.NoOrdersText>
          Nenhum pedido encontrado para essa mesa.
        </S.NoOrdersText>
      )}

      <ScrollView style={{ width: "100%" }}>
        {orders.map((order) => {
          const total = order.products.reduce(
            (sum, item) =>
              sum +
              (item.appliedPrice && item.appliedPrice > 0
                ? item.appliedPrice
                : item.product?.price ?? 0) *
                item.quantity,
            0
          );
          const isSelected = selectedOrders.includes(order.id);

          return (
            <S.OrderItem key={order.id}>
              <S.Row>
                <Checkbox
                  status={isSelected ? "checked" : "unchecked"}
                  onPress={() => toggleOrderSelection(order.id)}
                  color="#16a34a"
                />
                <S.OrderHeader>
                  <S.OrderText>Responsável: {order.responsible}</S.OrderText>
                  <S.OrderText>Total: R$ {total.toFixed(2)}</S.OrderText>
                </S.OrderHeader>
              </S.Row>

              {order.products.map((item) => {
                const price =
                  item.appliedPrice && item.appliedPrice > 0
                    ? item.appliedPrice
                    : item.product?.price ?? 0;
                return (
                  <S.ProductContainer key={item.productId}>
                    <S.ProductText>
                      Status: {getStatusLabel(item.status)}
                    </S.ProductText>
                    <S.ProductText>
                      Nome: {item.product?.name ?? "Produto não encontrado"}
                    </S.ProductText>
                    <S.ProductText>Preço: R$ {price.toFixed(2)}</S.ProductText>
                    <S.ProductText>
                      Cozinha: {item.product?.kitchen?.name ?? "Não definida"}
                    </S.ProductText>
                    <S.ProductText>Quantidade: {item.quantity}</S.ProductText>
                  </S.ProductContainer>
                );
              })}

              <S.PaymentMethodsContainer>
                <S.PaymentMethodsText>
                  Método de pagamento:
                </S.PaymentMethodsText>
                <S.PaymentOptions style={{ width: screenWidth * 0.9 }}>
                  {["PIX", "CASH", "CREDIT_CARD", "DEBIT_CARD"].map(
                    (method) => {
                      const selected = order.paymentMethod === method;
                      return (
                        <S.PaymentButton
                          key={method}
                          selected={selected}
                          onPress={() =>
                            handlePaymentMethodSelect(order.id, method)
                          }
                        >
                          <Ionicons
                            name={
                              method === "PIX"
                                ? "cash-outline"
                                : method === "CASH"
                                ? "wallet-outline"
                                : "card-outline"
                            }
                            size={24}
                            color={selected ? "#fff" : "#aaa"}
                          />
                          <S.PaymentButtonText selected={selected}>
                            {method === "PIX"
                              ? "PIX"
                              : method === "CASH"
                              ? "Dinheiro"
                              : method === "CREDIT_CARD"
                              ? "Crédito"
                              : "Débito"}
                          </S.PaymentButtonText>
                        </S.PaymentButton>
                      );
                    }
                  )}
                </S.PaymentOptions>

                {(order.paymentMethod === "CREDIT_CARD" ||
                  order.paymentMethod === "DEBIT_CARD") && (
                  <S.TaxList>
                    {paymentConfigs
                      .filter((c) => c.method === order.paymentMethod)
                      .map((config) => {
                        const selectedBrand = order.cardBrand === config.brand;
                        return (
                          <S.TaxItem
                            key={config.id}
                            selected={selectedBrand}
                            onPress={() =>
                              handleCardBrandSelect(order.id, config.brand!)
                            }
                          >
                            <S.TaxText selected={selectedBrand}>
                              {CardBrandLabels[config.brand ?? "OUTRO"]}
                            </S.TaxText>
                          </S.TaxItem>
                        );
                      })}
                  </S.TaxList>
                )}
              </S.PaymentMethodsContainer>

              <S.OrderText style={{ marginTop: 10 }}>Adicional (%)</S.OrderText>
              <TextInput
                keyboardType="numeric"
                value={String(additional)}
                onChangeText={(text) => handleAdditional(Number(text))}
                placeholder="Ex: 10"
                placeholderTextColor="#ccc"
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  borderRadius: 5,
                  fontSize: 16,
                  marginBottom: 10,
                }}
              />
            </S.OrderItem>
          );
        })}
      </ScrollView>

      {orders.length > 0 && (
        <S.ConcludeButton onPress={() => setIsModalVisible(true)}>
          <S.ConcludeButtonText>
            Concluir ({selectedOrders.length}) Comanda
            {selectedOrders.length !== 1 && "s"}
          </S.ConcludeButtonText>
        </S.ConcludeButton>
      )}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <S.ModalOverlay>
          <S.ModalContent>
            <S.ModalTitle>
              Deseja fechar as {selectedOrders.length} comandas selecionadas?
            </S.ModalTitle>
            <S.ModalButtonsContainer>
              <S.ModalButton
                variant="cancel"
                onPress={() => setIsModalVisible(false)}
              >
                <S.ModalButtonText>Cancelar</S.ModalButtonText>
              </S.ModalButton>
              <S.ModalButton
                variant="confirm"
                onPress={handleConcludeSelectedOrders}
              >
                <S.ModalButtonText>Fechar Comandas</S.ModalButtonText>
              </S.ModalButton>
            </S.ModalButtonsContainer>
          </S.ModalContent>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}
