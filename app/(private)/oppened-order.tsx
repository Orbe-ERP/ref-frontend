import React, { useEffect, useState } from "react";
import { ScrollView, Modal, TextInput, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  getOrders,
  Order,
  updatePaymentMethod,
  concludeOrders,
} from "@/services/order";
import useRestaurant from "@/hooks/useRestaurant";
import styled from "styled-components/native";
import Button from "@/components/atoms/Button";
import Toast from "react-native-toast-message";

export default function OpenedOrderScreen() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additional, setAdditional] = useState<number>(10);

  const { selectedRestaurant } = useRestaurant();
  const screenWidth = Dimensions.get("window").width;

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

  const handlePaymentMethodSelect = async (orderId: string, method: string) => {
    try {
      await updatePaymentMethod({ id: orderId, paymentMethod: method });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, paymentMethod: method } : order
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleConcludeOrders = async (sumIndividually: boolean) => {
    try {
      setIsModalVisible(false);
      const completedOrderDetails = await concludeOrders(
        tableId as string,
        sumIndividually,
        selectedRestaurant?.id,
        additional
      );
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

  const handleAdditional = (value: number) => {
    if (isNaN(value) || value <= 0) setAdditional(0);
    else if (value > 100) setAdditional(100);
    else setAdditional(value);
  };

  return (
    <Container>
      <Stack.Screen options={{ headerTitle: "Comandas Abertas" }} />

      {loading && <LoadingText>Carregando pedidos...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && orders.length === 0 && (
        <NoOrdersText>Nenhum pedido encontrado para essa mesa.</NoOrdersText>
      )}

      <ScrollView style={{ width: "100%" }}>
        {orders.map((order) => {
          const total = order.products.reduce(
            (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
            0
          );

          return (
            <OrderItem key={order.id}>
              <OrderText>Responsável: {order.responsible}</OrderText>
              <OrderText>Status: {getStatusLabel(order.status)}</OrderText>
              <OrderText>Produtos:</OrderText>

              {order.products.map((item) => (
                <ProductContainer key={item.productId}>
                  <ProductText>Nome: {item.product?.name ?? "Produto não encontrado"}</ProductText>
                  <ProductText>Preço: R${item.product?.price?.toFixed(2) ?? "0.00"}</ProductText>
                  <ProductText>
                    Cozinha: {item.product?.kitchen?.name ?? "Não definida"}
                  </ProductText>
                  <ProductText>Quantidade: {item.quantity}</ProductText>
                  {item.observations?.length > 0 && (
                    <ProductText>
                      Observações:{" "}
                      {item.observations.map((obs) => obs.observation?.description).filter(Boolean).join(", ")}
                    </ProductText>
                  )}
                </ProductContainer>
              ))}

              <TotalText>Total: R$ {total.toFixed(2)}</TotalText>

              <PaymentMethodsContainer>
                <PaymentMethodsText>Método de pagamento:</PaymentMethodsText>
                <PaymentOptions style={{ width: screenWidth * 0.9 }}>
                  {["PIX", "CASH", "CREDIT_CARD", "DEBIT_CARD"].map(
                    (method) => {
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
                                : method === "CREDIT_CARD"
                                ? "card-outline"
                                : "card-sharp"
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
                    }
                  )}
                </PaymentOptions>
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
                }}
              />

              <Button
                label="Concluir Comanda"
                onPress={() => setIsModalVisible(true)}
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

      <Modal visible={isModalVisible} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Deseja fechar essa comanda?</ModalTitle>
            <ModalButtonsContainer>
              <ModalButton onPress={() => setIsModalVisible(false)}>
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>
              <ModalButton onPress={() => handleConcludeOrders(false)}>
                <ModalButtonText>Fechar Comanda</ModalButtonText>
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
