import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import io from "socket.io-client";
import useRestaurant from "@/hooks/useRestaurant";
import { getOrdersByRestaurant, Order } from "@/services/order";
import { getKitchens, Kitchen } from "@/services/kitchen";
import {
  deleteProductFromOrder,
  updateStatusOnProduct,
} from "@/services/order-product";
import { useAppTheme } from "@/context/ThemeProvider/theme";

import KitchenOrderCard, {
  KitchenCompositionItem,
} from "@/components/molecules/KitchenOrderCard";

import * as S from "./styles";

function normalizeKitchenItems(orders: Order[]) {
  type KitchenOrder = {
    orderId: string;
    tableName: string;
    kitchenId: string;
    kitchen: { id: string; name: string; color?: string };
    items: KitchenCompositionItem[];
    totalQuantity: number;
  };

  const result: KitchenOrder[] = [];

  orders.forEach((order) => {
    const tableName = order.table?.name ?? "Mesa";

    const kitchenMap: Record<
      string,
      { items: KitchenCompositionItem[]; totalQuantity: number }
    > = {};

    order.products.forEach((orderProduct) => {
      if (orderProduct.status === "WAITING_DELIVERY") return;

      const productTotalQuantity = orderProduct.quantity;
      const product = orderProduct.product;

      if (product.compositions.length === 0) {
        const kitchen = product.kitchens?.[0];
        if (!kitchen) return;

        const kitchenId = kitchen.id;

        if (!kitchenMap[kitchenId]) {
          kitchenMap[kitchenId] = {
            items: [],
            totalQuantity: 0,
          };
        }

        kitchenMap[kitchenId].items.push({
          orderId: order.id,
          orderProductId: orderProduct.id,
          tableName,
          productName: product.name,
          compositionName: "Item simples",
          quantity: productTotalQuantity,
          kitchen,
          status: orderProduct.status,
        });

        kitchenMap[kitchenId].totalQuantity += productTotalQuantity;
        return;
      }

      /** ===============================
       *  CASO 2 — PRODUTO COM COMPOSIÇÃO
       * =============================== */
      product.compositions.forEach((comp) => {
        if (!comp.kitchen?.showOnKitchen) return;

        const kitchenId = comp.kitchen.id;

        if (!kitchenMap[kitchenId]) {
          kitchenMap[kitchenId] = {
            items: [],
            totalQuantity: 0,
          };
        }

        kitchenMap[kitchenId].items.push({
          orderId: order.id,
          orderProductId: orderProduct.id,
          tableName,
          productName: product.name,
          compositionName: comp.stockItem.name,
          quantity: comp.quantity,
          kitchen: comp.kitchen,
          status: orderProduct.status,
        });

        kitchenMap[kitchenId].totalQuantity += comp.quantity;
      });
    });

    Object.entries(kitchenMap).forEach(
      ([kitchenId, { items, totalQuantity }]) => {
        if (items.length > 0) {
          result.push({
            orderId: order.id,
            tableName,
            kitchenId,
            kitchen: items[0].kitchen,
            items,
            totalQuantity,
          });
        }
      }
    );
  });

  return result;
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [selectedKitchenId, setSelectedKitchenId] = useState<string>("null");
  const [loading, setLoading] = useState(true);
  const { selectedRestaurant } = useRestaurant();
  const theme = useAppTheme();

  useEffect(() => {
    if (!selectedRestaurant) return;

    const socket = io("http://localhost:3001");

    const fetchData = async () => {
      try {
        const [ordersData, kitchensData] = await Promise.all([
          getOrdersByRestaurant(selectedRestaurant.id),
          getKitchens(selectedRestaurant.id),
        ]);
        setOrders(ordersData);
        setKitchens(kitchensData);
      } catch {
        Toast.show({ type: "error", text1: "Erro ao carregar dados" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("newOrder", (order: Order) => {
      setOrders((prev) => [...prev, order]);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRestaurant]);

  const handleProductStatus = async (
    orderProductId: string,
    status: string
  ) => {
    try {
      const updated = await updateStatusOnProduct({ orderProductId, status });
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          products: order.products.map((p) =>
            p.id === orderProductId ? { ...p, status: updated.status } : p
          ),
        }))
      );
    } catch {
      Toast.show({ type: "error", text1: "Erro ao atualizar status" });
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
      Toast.show({ type: "success", text1: "Item cancelado" });
    } catch {
      Toast.show({ type: "error", text1: "Erro ao cancelar item" });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#029269" />;
  }

  const kitchenItems = normalizeKitchenItems(orders);

  const filteredKitchens =
    selectedKitchenId === "null"
      ? kitchenItems
      : kitchenItems.filter((k) => k.kitchenId === selectedKitchenId);

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
            onValueChange={setSelectedKitchenId}
            style={{ color: theme.theme.colors.text.primary, backgroundColor: theme.theme.colors.surface }}
              itemStyle={{ color: theme.theme.colors.text.primary }} 
            dropdownIconColor={theme.theme.colors.text.primary}
          >
            <Picker.Item label="Todas as cozinhas" value="null" />
            {kitchens
              .filter((k) => k.showOnKitchen)
              .map((k) => (
                <Picker.Item
                  key={k.id}
                  label={k.name}
                  value={k.id}
                />
              ))}
          </Picker>
        </S.PickerContainer>

        {filteredKitchens.length === 0 && (
          <S.EmptyText>Nenhum item para esta cozinha.</S.EmptyText>
        )}

        {filteredKitchens.map((kitchenOrder) => (
          <View
            key={`${kitchenOrder.kitchenId}-${kitchenOrder.orderId}`}
            style={{ marginBottom: 24 }}
          >
            <KitchenOrderCard
              tableName={kitchenOrder.tableName}
              items={kitchenOrder.items}
              totalQuantity={kitchenOrder.totalQuantity}
              onUpdateStatus={handleProductStatus}
              onCancelOrder={(productId) =>
                handleDeleteProduct(kitchenOrder.orderId, productId)
              }
            />
          </View>
        ))}
      </S.Container>
    </>
  );
}
