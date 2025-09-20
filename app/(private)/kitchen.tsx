import OrderCard from "@/components/molecules/OrderCard";
import useRestaurant from "@/hooks/useRestaurant";
import { getOrdersByRestaurant, Order, updateStatus } from "@/services/order";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import io from "socket.io-client";
import styled from "styled-components/native";

type KitchenType = "MEAT" | "OTHERS" | "UNCOOKABLE" | "default";

export default function KitchenScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRestaurant } = useRestaurant();

  const kitchenColors: Record<KitchenType, string> = {
    MEAT: "#FF5733",
    OTHERS: "#33A1FF",
    UNCOOKABLE: "#FF33F1",
    default: "#A0AEC0",
  };

  const getMainKitchen = (order: Order): KitchenType => {
    if (!order.products.length) return "default";

    const kitchenCount = order.products.reduce((acc, product) => {
      const kitchenKey = product.product.kitchen.toUpperCase();
      if (Object.keys(kitchenColors).includes(kitchenKey)) {
        const validKey = kitchenKey as KitchenType;
        acc[validKey] = (acc[validKey] || 0) + 1;
      }
      return acc;
    }, {} as Record<KitchenType, number>);

    if (Object.keys(kitchenCount).length === 0) return "default";

    const mainKitchen = Object.entries(kitchenCount).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return mainKitchen;
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");

    const fetchOrders = async () => {
      if (!selectedRestaurant) return;
      setLoading(true);
      try {
        const fetchedOrders = await getOrdersByRestaurant(
          selectedRestaurant.id
        );
        setOrders(fetchedOrders);
      } catch (err) {
        setError("Erro ao buscar pedidos");
      }
      setLoading(false);
    };

    fetchOrders();

    socket.on("newOrder", (newOrder: Order) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    return () => {
      socket.off("newOrder");
    };
  }, [selectedRestaurant]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await updateStatus({ id: orderId, status });
      setOrders((prevOrders) =>
        prevOrders
          .map((order) =>
            order.id === orderId
              ? { ...order, status: updatedOrder.status }
              : order
          )
          .filter(
            (order) =>
              order.status !== "CANCELED" && order.status !== "WAITING_DELIVERY"
          )
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status do pedido.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#029269" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: "Cozinha" }} />
      <Container>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Order }) => {
            const mainKitchen = getMainKitchen(item);
            const kitchenColor =
              kitchenColors[mainKitchen] || kitchenColors.default;

            return (
              <OrderCard
                order={item}
                mainKitchen={mainKitchen}
                kitchenColor={kitchenColor}
                onUpdateStatus={handleUpdateStatus}
              />
            );
          }}
          ListEmptyComponent={
            <EmptyText>Nenhum pedido encontrado no momento.</EmptyText>
          }
        />
      </Container>
    </>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  justify-content: center;
  padding: 24px;
`;
const EmptyText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
`;
