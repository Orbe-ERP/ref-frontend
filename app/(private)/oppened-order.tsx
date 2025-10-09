import React, { useEffect, useState } from "react";
import { ScrollView, Modal, TextInput, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  getOrders,
  Order,
  concludeOrders,
  concludeOrder,
} from "@/services/order";
import useRestaurant from "@/hooks/useRestaurant";
import styled from "styled-components/native";
import Button from "@/components/atoms/Button";
import Toast from "react-native-toast-message";
import {
  getPaymentConfigs,
  PaymentConfig,
  CardBrandLabels,
} from "@/services/payment";

export default function OpenedOrderScreen() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additional, setAdditional] = useState<number>(10);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const screenWidth = Dimensions.get("window").width;

  // Carrega pedidos
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

  // Carrega configurações de pagamento
  useEffect(() => {
    async function loadConfigs() {
      if (selectedRestaurant?.id) {
        const configs = await getPaymentConfigs(selectedRestaurant.id);
        setPaymentConfigs(configs);
      }
    }
    loadConfigs();
  }, [selectedRestaurant?.id]);

  // Seleção de método de pagamento por ordem
  const handlePaymentMethodSelect = (orderId: string, method: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentMethod: method,
              cardBrand:
                method === "CREDIT_CARD" || method === "DEBIT_CARD"
                  ? o.cardBrand
                  : undefined,
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

  // Concluir todas as comandas da mesa
  const handleConcludeOrders = async (sumIndividually: boolean) => {
    try {
      setIsModalVisible(false);

      const firstOrder = orders[0];
      if (!firstOrder?.paymentMethod) throw new Error("Selecione o método de pagamento");

      const isCard =
        firstOrder.paymentMethod === "CREDIT_CARD" || firstOrder.paymentMethod === "DEBIT_CARD";
      const paymentConfigId = isCard
        ? paymentConfigs.find(
            (c) =>
              c.method === firstOrder.paymentMethod && c.brand === firstOrder.cardBrand
          )?.id ?? null
        : null;

      const payload = {
        tableId: tableId as string,
        restaurantId: selectedRestaurant?.id!,
        sumIndividually,
        additional,
        paymentMethod: firstOrder.paymentMethod as any,
        paymentConfigId,
      };

      console.log("📦 Concluindo todas as comandas:", payload);

      const completedOrderDetails = await concludeOrders(payload);
      await fetchOrders();

      router.push({
        pathname: "/(tabs)/table",
        params: { orderDetails: JSON.stringify(completedOrderDetails) },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao concluir pedidos",
        text2: "Não foi possível concluir os pedidos. Tente novamente.",
      });
    }
  };

  // Concluir uma única comanda
  const handleConcludeSingleOrder = async (orderId: string) => {
    try {
      setIsModalVisible(false);

      const selectedOrder = orders.find((o) => o.id === orderId);
      if (!selectedOrder || !selectedOrder.paymentMethod) return;

      const isCard =
        selectedOrder.paymentMethod === "CREDIT_CARD" || selectedOrder.paymentMethod === "DEBIT_CARD";
      const paymentConfigId = isCard
        ? paymentConfigs.find(
            (c) =>
              c.method === selectedOrder.paymentMethod && c.brand === selectedOrder.cardBrand
          )?.id ?? null
        : null;

      const payload = {
        orderId,
        restaurantId: selectedRestaurant?.id!,
        additional,
        paymentMethod: selectedOrder.paymentMethod,
        paymentConfigId,
      };

      console.log("📦 Concluindo comanda:", payload);

      const completedOrder = await concludeOrder(payload);
      await fetchOrders();

      router.push({
        pathname: "/(tabs)/table",
        params: { orderDetails: JSON.stringify(completedOrder) },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao concluir comanda",
        text2: "Não foi possível concluir a comanda. Tente novamente.",
      });
    }
  };

  // Função auxiliar de status
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
    <Container>
      <Stack.Screen
        options={{
          headerTitle: "Comandas Abertas",
          headerStyle: { backgroundColor: "#041224" },
        }}
      />

      <TopBar>
        <OrderCountText>Comandas Abertas: {orders.length}</OrderCountText>
      </TopBar>

      {loading && <LoadingText>Carregando pedidos...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && orders.length === 0 && (
        <NoOrdersText>Nenhum pedido encontrado para essa mesa.</NoOrdersText>
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

          return (
            <OrderItem key={order.id}>
              <OrderText>Responsável: {order.responsible}</OrderText>
              <OrderText>Produtos:</OrderText>

              {order.products.map((item) => {
                const price =
                  item.appliedPrice && item.appliedPrice > 0
                    ? item.appliedPrice
                    : item.product?.price ?? 0;

                return (
                  <ProductContainer key={item.productId}>
                    <ProductText>Status: {getStatusLabel(item.status)}</ProductText>
                    <ProductText>Nome: {item.product?.name ?? "Produto não encontrado"}</ProductText>
                    <ProductText>Preço: R$ {price.toFixed(2)}</ProductText>
                    <ProductText>Cozinha: {item.product?.kitchen?.name ?? "Não definida"}</ProductText>
                    <ProductText>Quantidade: {item.quantity}</ProductText>
                  </ProductContainer>
                );
              })}

              <TotalText>Total: R$ {total.toFixed(2)}</TotalText>

              {/* Seleção de método de pagamento */}
              <PaymentMethodsContainer>
                <PaymentMethodsText>Método de pagamento:</PaymentMethodsText>
                <PaymentOptions style={{ width: screenWidth * 0.9 }}>
                  {["PIX", "CASH", "CREDIT_CARD", "DEBIT_CARD"].map((method) => {
                    const isSelected = order.paymentMethod === method;
                    return (
                      <PaymentButton
                        key={method}
                        selected={isSelected}
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
                          color={isSelected ? "#fff" : "#aaa"}
                        />
                        <PaymentButtonText selected={isSelected}>
                          {method === "PIX"
                            ? "PIX"
                            : method === "CASH"
                            ? "Dinheiro"
                            : method === "CREDIT_CARD"
                            ? "Crédito"
                            : "Débito"}
                        </PaymentButtonText>
                      </PaymentButton>
                    );
                  })}
                </PaymentOptions>

                {(order.paymentMethod === "CREDIT_CARD" ||
                  order.paymentMethod === "DEBIT_CARD") && (
                  <TaxList>
                    {paymentConfigs
                      .filter((config) => config.method === order.paymentMethod)
                      .map((config) => {
                        const isBrandSelected = order.cardBrand === config.brand;
                        return (
                          <TaxItem
                            key={config.id}
                            selected={isBrandSelected}
                            onPress={() =>
                              handleCardBrandSelect(order.id, config.brand!)
                            }
                          >
                            <TaxText selected={isBrandSelected}>
                              {CardBrandLabels[config.brand ?? "OUTRO"]}
                            </TaxText>
                          </TaxItem>
                        );
                      })}
                  </TaxList>
                )}
              </PaymentMethodsContainer>

              <OrderText style={{ marginTop: 10 }}>Adicional (%)</OrderText>
              <TextInput
                keyboardType="numeric"
                value={String(additional)}
                onChangeText={(text) => {
                  const numericValue = Number(text);
                  handleAdditional(isNaN(numericValue) ? 0 : numericValue);
                }}
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

              <Button
                label="Concluir Comanda"
                variant="primary"
                onPress={() => handleConcludeSingleOrder(order.id)}
              />
            </OrderItem>
          );
        })}
      </ScrollView>

      {orders.length > 0 && (
        <ConcludeButton onPress={() => setIsModalVisible(true)}>
          <ConcludeButtonText>Concluir todas as comandas</ConcludeButtonText>
        </ConcludeButton>
      )}

      {/* Modal de confirmação */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Deseja fechar todas as comandas?</ModalTitle>
            <ModalButtonsContainer>
              <ModalButton onPress={() => setIsModalVisible(false)}>
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>
              <ModalButton onPress={() => handleConcludeOrders(false)}>
                <ModalButtonText>Fechar Comandas</ModalButtonText>
              </ModalButton>
            </ModalButtonsContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}


export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 80%;
  background-color: #041b38;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

export const ModalTitle = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const ModalButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const ModalButton = styled.TouchableOpacity<{
  variant?: "cancel" | "confirm";
}>`
  flex: 1;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  background-color: ${({ variant }) =>
    variant === "cancel" ? "#dc3545" : "#038082"};
`;

export const ModalButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

export const Container = styled.View`
  flex: 1;
  background-color: #041224;
  align-items: center;
  padding: 0 10px;
`;

export const LoadingText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin: 20px 0;
`;

export const ErrorText = styled.Text`
  color: red;
  font-size: 16px;
  margin: 20px 0;
`;

export const NoOrdersText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin: 20px 0;
`;

export const OrdersList = styled.ScrollView`
  margin-top: 10px;
  width: 100%;
`;

export const ConcludeButton = styled.TouchableOpacity`
  background-color: #038082;
  padding: 15px 0;
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-offset: 0px 4px;
  shadow-radius: 6px;
  margin-bottom: 20px;
`;

export const ConcludeButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  text-align: center;
`;

export const OrderItem = styled.View`
  background-color: #041b38;
  padding: 10px 15px;
  border-radius: 10px;
  margin: 10px 0;
  shadow-color: #038082;
  shadow-opacity: 0.3;
  shadow-offset: 0px 2px;
  shadow-radius: 5px;
`;

export const OrderText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 5px;
`;

export const ProductContainer = styled.View`
  margin: 5px 0;
`;

export const ProductText = styled.Text`
  color: #ffffff;
  font-size: 14px;
`;

export const TotalText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin-top: 10px;
  font-weight: bold;
`;

export const PaymentMethodsContainer = styled.View`
  margin: 15px 0;
`;

export const TopBar = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const OrderCountText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;


export const PaymentMethodsText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: bold;
`;

export const PaymentOptions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

export const PaymentButton = styled.TouchableOpacity<{ selected?: boolean }>`
  background-color: ${({ selected }) => (selected ? "#038082" : "#e9ecef")};
  padding: 12px 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  flex-basis: 48%;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const PaymentButtonText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }) => (selected ? "#fff" : "#6c757d")};
  margin-left: 5px;
  font-size: 14px;
  font-weight: bold;
`;

const TaxList = styled.View`
  margin-top: 12px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const TaxItem = styled.TouchableOpacity<{ selected?: boolean }>`
  background-color: ${({ selected }) => (selected ? "#9fd6d2" : "#1a1a1a")};
  border: 1px solid ${({ selected }) => (selected ? "#9fd6d2" : "#444")};
  border-radius: 8px;
  padding: 8px 12px;
`;

const TaxText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }) => (selected ? "#041224" : "#fff")};
  font-size: 14px;
`;

