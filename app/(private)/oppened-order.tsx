import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";

import useRestaurant from "@/hooks/useRestaurant";
import { concludeOrders, getOrders, Order, updatePaymentMethod } from "@/services/order";

import ConfirmModal from "@/components/molecules/ConfirmModal";
import OrderCard from "@/components/molecules/OrderCard";

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 16px;
`;

const Message = styled.Text`
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
`;

const ConcludeButton = styled.TouchableOpacity`
  background-color: #038082;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
`;

const ConcludeButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  text-align: center;
`;

export default function OpenedOrderScreen() {
  const { tableId } = useLocalSearchParams<{ tableId?: string }>(); // pode ser undefined
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additional, setAdditional] = useState<number>(10);

  useEffect(() => {
    if (!tableId) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrders(tableId);
        setOrders(data);
      } catch {
        setError("Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tableId]);

  const handlePaymentMethodSelect = async (orderId: string, method: string) => {
    try {
      await updatePaymentMethod({ id: orderId, paymentMethod: method });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, paymentMethod: method } : o))
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível atualizar o método de pagamento.");
    }
  };

  const handleConcludeOrders = async (sumIndividually: boolean) => {
    if (!tableId) return;

    try {
      setIsModalVisible(false);
      const completedOrderDetails = await concludeOrders(
        tableId,
        sumIndividually,
        selectedRestaurant?.id,
        additional
      );
      const updated = await getOrders(tableId);
      setOrders(updated);
      router.push({
        pathname: "/(private)/printed-order",
        params: { orderDetails: JSON.stringify(completedOrderDetails) },
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível concluir a comanda.");
    }
  };

  if (loading) return <Message>Carregando pedidos...</Message>;
  if (error) return <Message>{error}</Message>;
  if (orders.length === 0) return <Message>Nenhum pedido encontrado.</Message>;

  return (
    <>
      <Stack.Screen options={{title: "Comandas abertas", }} />
      <Container>
        <ScrollView>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              additional={additional}
              onChangeAdditional={setAdditional}
              onPaymentSelect={handlePaymentMethodSelect}
              onConclude={() => setIsModalVisible(true)}
            />
          ))}
        </ScrollView>

        {orders.length > 0 && (
          <ConcludeButton onPress={() => setIsModalVisible(true)}>
            <ConcludeButtonText>Concluir todas as comandas</ConcludeButtonText>
          </ConcludeButton>
        )}

        <ConfirmModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={() => handleConcludeOrders(false)}
        />
      </Container>
    </>
  );
}
