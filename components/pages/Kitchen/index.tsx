import OrderCard from "@/components/molecules/OrderCard";
import useRestaurant from "@/hooks/useRestaurant";
import { getOrdersByRestaurant, Order } from "@/services/order";
import { getKitchens, Kitchen } from "@/services/kitchen";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import io from "socket.io-client";
import * as S from "./styles";
import {
  deleteProductFromOrder,
  updateQuantityOnProduct,
  updateStatusOnProduct,
} from "@/services/order-product";
import { deleteObservationLink } from "@/services/order-product-obs";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [selectedKitchenId, setSelectedKitchenId] = useState<string>("null");
  const { selectedRestaurant } = useRestaurant();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [observationToDelete, setObservationToDelete] = useState<{
    obsId: string;
    orderId: string;
    productId: string;
  } | null>(null);
  const theme = useAppTheme()

  const DEFAULT_KITCHEN_COLOR = "#A0AEC0";

  const groupOrders = (orders: Order[], filterKitchenId?: string) => {
    const grouped: Record<
      string,
      Record<string, { order: Order; products: (typeof orders)[0]["products"] }>
    > = {};

    orders.forEach((order) => {
      const tableName = order.table?.name || "Mesa Desconhecida";
      if (!grouped[tableName]) grouped[tableName] = {};

      let productsToGroup =
        !filterKitchenId || filterKitchenId === "null"
          ? order.products
          : order.products.filter(
              (p) => p.product.kitchen?.id === filterKitchenId
            );

      productsToGroup = productsToGroup.filter(
        (p) => p.status !== "CANCELED" && p.status !== "COMPLETED"
      );

      if (productsToGroup.length === 0) return;

      productsToGroup.forEach((product) => {
        const kitchenId = product.product.kitchen?.id || "default";
        if (!grouped[tableName][kitchenId]) {
          grouped[tableName][kitchenId] = { order, products: [] };
        }
        grouped[tableName][kitchenId].products.push(product);
      });
    });

    return grouped;
  };

  useEffect(() => {
    const socket = io("http://192.168.1.7:3001");

    const fetchOrders = async () => {
      if (!selectedRestaurant) return;
      setLoading(true);
      try {
        const fetchedOrders = await getOrdersByRestaurant(
          selectedRestaurant.id
        );
        setOrders(fetchedOrders);
      } catch (err) {
        Toast.show({ type: "error", text1: "Erro ao buscar pedidos" });
      }
      setLoading(false);
    };

    const fetchKitchens = async () => {
      if (!selectedRestaurant) return;
      try {
        const kitchensList = await getKitchens(selectedRestaurant.id);
        setKitchens(kitchensList);
      } catch (err) {
        Toast.show({ type: "error", text1: "Erro ao buscar cozinhas" });
      }
    };

    fetchOrders();
    fetchKitchens();

    socket.on("newOrder", (newOrder: Order) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    return () => {
      socket.off("newOrder");
    };
  }, [selectedRestaurant]);

  const handleProductStatus = async (
    orderProductId: string,
    status: string
  ) => {
    try {
      const updatedProduct = await updateStatusOnProduct({
        orderProductId,
        status,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          products: order.products.map((p) =>
            p.id === orderProductId
              ? { ...p, status: updatedProduct.status }
              : p
          ),
        }))
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Não foi possível atualizar o status do produto.",
      });
    }
  };

  const handleUpdateQuantity = async (
    orderId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      const updatedProduct = await updateQuantityOnProduct({
        orderProductId: productId,
        quantity,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                products: order.products.map((p) =>
                  p.id === productId
                    ? { ...p, quantity: updatedProduct.quantity }
                    : p
                ),
              }
            : order
        )
      );
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Não foi possível atualizar a quantidade",
      });
    }
  };

  const handleDeleteProduct = async (orderId: string, productId: string) => {
    try {
      await deleteProductFromOrder(productId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                products: order.products.filter((p) => p.id !== productId),
              }
            : order
        )
      );
      Toast.show({ type: "success", text1: "Produto removido com sucesso" });
    } catch {
      Toast.show({ type: "error", text1: "Erro ao remover produto" });
    }
  };

  const handleDeleteObservation = async (
    orderId: string,
    productId: string,
    obsId: string
  ) => {
    try {
      await deleteObservationLink(obsId);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                products: order.products.map((p) =>
                  p.id === productId
                    ? {
                        ...p,
                        observations: p.observations.filter(
                          (obs) => obs.id !== obsId
                        ),
                      }
                    : p
                ),
              }
            : order
        )
      );

      Toast.show({ type: "success", text1: "Observação removida com sucesso" });
    } catch {
      Toast.show({ type: "error", text1: "Erro ao remover observação" });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#029269" />;
  }

  const groupedOrders = groupOrders(orders, selectedKitchenId);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cozinha",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
        }}
      />
      <S.Container>
        <S.PickerContainer>
          <Picker
            selectedValue={selectedKitchenId}
            onValueChange={(value) => setSelectedKitchenId(value)}
            style={{ color: "#fff", backgroundColor: "#1E293B" }}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Todas as cozinhas" value="null" />
            {kitchens
              .filter((k) => k.showOnKitchen)
              .map((kitchen) => (
                <Picker.Item
                  key={kitchen.id}
                  label={kitchen.name}
                  value={kitchen.id}
                  color="#fff"
                />
              ))}
          </Picker>
        </S.PickerContainer>

        {Object.entries(groupedOrders).length === 0 && (
          <S.EmptyText>Nenhum pedido encontrado no momento.</S.EmptyText>
        )}

        {Object.entries(groupedOrders).map(([tableName, kitchens]) => (
          <View key={tableName} style={{ marginBottom: 24 }}>
            <S.TableName>{tableName}</S.TableName>

            {Object.entries(kitchens).map(
              ([kitchenId, { order, products }]) => {
                const kitchenCount: Record<string, number> = {};
                products.forEach((p) => {
                  const name = p.product.kitchen?.name || "default";
                  kitchenCount[name] = (kitchenCount[name] || 0) + 1;
                });
                const mainKitchen = Object.entries(kitchenCount).sort(
                  (a, b) => b[1] - a[1]
                )[0][0];

                const kitchenName =
                  products[0]?.product.kitchen?.name || "Cozinha";
                const kitchenColor =
                  products[0]?.product.kitchen?.color || DEFAULT_KITCHEN_COLOR;

                return (
                  <View key={kitchenId} style={{ marginBottom: 16 }}>

                    <OrderCard
                      order={{ ...order, products }}
                      handleProductStatus={handleProductStatus}
                      onUpdateQuantity={(productId, quantity) =>
                        handleUpdateQuantity(order.id, productId, quantity)
                      }
                      confirmDeleteObservation={(productId, obsId) =>
                        handleDeleteObservation(order.id, productId, obsId)
                      }
                      handleDeleteProduct={(
                        orderId: string,
                        productId: string
                      ) => handleDeleteProduct(orderId, productId)}
                    />
                  </View>
                );
              }
            )}
          </View>
        ))}
      </S.Container>
    </>
  );
}
