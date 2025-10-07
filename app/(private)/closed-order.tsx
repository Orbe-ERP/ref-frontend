import React, { useEffect, useState } from "react";
import { ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import styled from "styled-components/native";
import Toast from "react-native-toast-message";
import useRestaurant from "@/hooks/useRestaurant";
import { getClosedOrders, Order } from "@/services/order";
import Button from "@/components/atoms/Button";
import { TopButton, TopButtonsContainer, TopButtonText } from "./oppened-order";

export default function ClosedOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { selectedRestaurant } = useRestaurant();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const fetchClosedOrders = async () => {
    try {
      setLoading(true);
      const data = await getClosedOrders(selectedRestaurant?.id);
      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar comandas fechadas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant?.id) fetchClosedOrders();
  }, [selectedRestaurant]);

  const handlePrintOrder = (orderId: string) => {
    Toast.show({
      type: "info",
      text1: "Impressão",
      text2: `Imprimindo comanda #${orderId}...`,
    });
    // 🔹 aqui você pode chamar sua função de impressão real
  };

  return (
    <Container>
        <Stack.Screen
            options={{
            headerTitle: "Comandas Fechadas",
            headerRight: () => (
                <Ionicons
                name="refresh-outline"
                size={24}
                color="white"
                style={{ marginRight: 15 }}
                onPress={fetchClosedOrders}
                />
            ),
            }}
        />

        <TopBar>
            <OrderCountText>Comandas Abertas: {orders.length}</OrderCountText>
            <TopButtonsContainer>
                <TopButton>
                    <TopButtonText>Ver Comandas Fechadas</TopButtonText>
                </TopButton>
            </TopButtonsContainer>
        </TopBar>

      {loading && <LoadingText>Carregando comandas...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && orders.length === 0 && (
        <NoOrdersText>Nenhuma comanda fechada encontrada.</NoOrdersText>
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
              <OrderText>Data: {new Date(order.createdAt).toLocaleString()}</OrderText>

              <OrderText style={{ marginTop: 8 }}>Produtos:</OrderText>
              {order.products.map((item) => (
                <ProductContainer key={item.productId}>
                  <ProductText>
                    {item.product?.name ?? "Produto não encontrado"} —{" "}
                    {item.quantity}x
                  </ProductText>
                </ProductContainer>
              ))}

              <TotalText>Total: R$ {total.toFixed(2)}</TotalText>

              <Button
                label="Imprimir novamente"
                onPress={() => handlePrintOrder(order.id)}
              />
            </OrderItem>
          );
        })}
      </ScrollView>
    </Container>
  );
}

// 🔹 ESTILOS (reaproveitados da tela base)
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
