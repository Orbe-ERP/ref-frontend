import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, Dimensions, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Checkbox } from "react-native-paper";
import { getOrders, Order, concludeOrders } from "@/services/order";
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
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additional, setAdditional] = useState<number>(10);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const screenWidth = Dimensions.get("window").width;

  // --- Fetch Orders ---
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

  // --- Load payment configs ---
  useEffect(() => {
    async function loadConfigs() {
      if (selectedRestaurant?.id) {
        const configs = await getPaymentConfigs(selectedRestaurant.id);
        setPaymentConfigs(configs);
      }
    }
    loadConfigs();
  }, [selectedRestaurant?.id]);

  // --- Selection ---
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // --- Payment selection ---
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

  console.log(orders);

  const handleCardBrandSelect = (orderId: string, brand: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? { ...o, cardBrand: o.cardBrand === brand ? undefined : brand }
          : o
      )
    );
  };

  // --- Conclude selected orders ---
  const handleConcludeSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      Alert.alert("Aviso", "Selecione pelo menos uma comanda para concluir.");
      return;
    }

    try {
      // Validação: todas as selecionadas têm método de pagamento
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
          const isSelected = selectedOrders.includes(order.id);

          return (
            <OrderItem key={order.id}>
              <Row>
                <Checkbox
                  status={isSelected ? "checked" : "unchecked"}
                  onPress={() => toggleOrderSelection(order.id)}
                  color="#16a34a"
                />
                <OrderHeader>
                  <OrderText>Responsável: {order.responsible}</OrderText>
                  <OrderText>Total: R$ {total.toFixed(2)}</OrderText>
                </OrderHeader>
              </Row>

              {order.products.map((item) => {
                const price =
                  item.appliedPrice && item.appliedPrice > 0
                    ? item.appliedPrice
                    : item.product?.price ?? 0;
                return (
                  <ProductContainer key={item.productId}>
                    <ProductText>
                      Status: {getStatusLabel(item.status)}
                    </ProductText>
                    <ProductText>
                      Nome: {item.product?.name ?? "Produto não encontrado"}
                    </ProductText>
                    <ProductText>Preço: R$ {price.toFixed(2)}</ProductText>
                    <ProductText>
                      Cozinha: {item.product?.kitchen?.name ?? "Não definida"}
                    </ProductText>
                    <ProductText>Quantidade: {item.quantity}</ProductText>
                  </ProductContainer>
                );
              })}

              {/* Payment */}
              <PaymentMethodsContainer>
                <PaymentMethodsText>Método de pagamento:</PaymentMethodsText>
                <PaymentOptions style={{ width: screenWidth * 0.9 }}>
                  {["PIX", "CASH", "CREDIT_CARD", "DEBIT_CARD"].map(
                    (method) => {
                      const selected = order.paymentMethod === method;
                      return (
                        <PaymentButton
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
                          <PaymentButtonText selected={selected}>
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
                    }
                  )}
                </PaymentOptions>

                {(order.paymentMethod === "CREDIT_CARD" ||
                  order.paymentMethod === "DEBIT_CARD") && (
                  <TaxList>
                    {paymentConfigs
                      .filter((c) => c.method === order.paymentMethod)
                      .map((config) => {
                        const selectedBrand = order.cardBrand === config.brand;
                        return (
                          <TaxItem
                            key={config.id}
                            selected={selectedBrand}
                            onPress={() =>
                              handleCardBrandSelect(order.id, config.brand!)
                            }
                          >
                            <TaxText selected={selectedBrand}>
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
            </OrderItem>
          );
        })}

      </ScrollView>

      {orders.length > 0 && (
        <ConcludeButton onPress={() => setIsModalVisible(true)}>
          <ConcludeButtonText>
            Concluir ({selectedOrders.length}) Comanda
            {selectedOrders.length !== 1 && "s"}
          </ConcludeButtonText>
        </ConcludeButton>
      )}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              Deseja fechar as {selectedOrders.length} comandas selecionadas?
            </ModalTitle>
            <ModalButtonsContainer>
              <ModalButton
                variant="cancel"
                onPress={() => setIsModalVisible(false)}
              >
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>
              <ModalButton
                variant="confirm"
                onPress={handleConcludeSelectedOrders}
              >
                <ModalButtonText>Fechar Comandas</ModalButtonText>
              </ModalButton>
            </ModalButtonsContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const OrderHeader = styled.View`
  margin-left: 8px;
`;

export const OrderItem = styled.TouchableOpacity<{ selected?: boolean }>`
  background-color: ${({ selected }: { selected?: boolean }) =>
    selected ? "#038082" : "#041b38"};
  padding: 10px 15px;
  border-radius: 10px;
  margin: 10px 0;
  shadow-color: #038082;
  shadow-opacity: 0.3;
  shadow-offset: 0px 2px;
  shadow-radius: 5px;
`;

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

interface ModalButtonProps {
  variant?: "cancel" | "confirm";
}

export const ModalButton = styled.TouchableOpacity<ModalButtonProps>`
  flex: 1;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  background-color: ${({ variant }: ModalButtonProps) =>
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
  background-color: transparent;
  padding: 12px 0;
  border-radius: 5px;
  margin: 10px 0 20px 0;
  width: 100%;
  border: 1px solid #038082;
  align-items: center;
`;

export const ConcludeButtonText = styled.Text`
  color: #038082;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
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
  background-color: ${({ selected }: { selected?: boolean }) =>
    selected ? "#038082" : "#e9ecef"};
  padding: 12px 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  flex-basis: 48%;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const PaymentButtonText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }: { selected?: boolean }) =>
    selected ? "#fff" : "#6c757d"};
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
  background-color: ${({ selected }: { selected?: boolean }) =>
    selected ? "#038082" : "#e9ecef"};
  border-radius: 8px;
  padding: 8px 12px;
`;

const TaxText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }: { selected?: boolean }) =>
    selected ? "#fff" : "#6c757d"};
  font-size: 14px;
  font-weight: bold;
`;
