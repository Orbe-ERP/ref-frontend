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


function normalizeKitchenItems(orders: Order[] = []) {
  const result: any[] = [];

  orders.forEach((order) => {
    const tableName = order?.table?.name ?? "Mesa";

    const kitchenMap: Record<
      string,
      { items: KitchenCompositionItem[]; totalQuantity: number }
    > = {};

    const products = Array.isArray(order.products) ? order.products : [];

    products.forEach((orderProduct: any) => {
      if (orderProduct?.status === "WAITING_DELIVERY") return;

      const product = orderProduct?.product;
      if (!product) return;

      const compositions = Array.isArray(product.compositions)
        ? product.compositions
        : [];

      const modifiers =
        orderProduct?.OrderProductModifier?.map((m: any) => ({
          name: m?.modifier?.name,
          textValue: m?.textValue ?? null,
          quantity: m?.quantity ?? 0,
        })) ?? [];

      const productQuantity = orderProduct?.quantity ?? 0;

      if (compositions.length === 0) {
        const kitchen = product?.kitchens?.[0];
        if (!kitchen || kitchen.showOnKitchen === false) return;

        if (!kitchenMap[kitchen.id]) {
          kitchenMap[kitchen.id] = { items: [], totalQuantity: 0 };
        }

        kitchenMap[kitchen.id].items.push({
          orderId: order.id,
          orderProductId: orderProduct.id,
          tableName,
          productName: product.name,
          compositionName: "Item simples",
          quantity: productQuantity,
          kitchen,
          status: orderProduct.status,
          customObservation: orderProduct.customObservation,
          modifiers,
        });

        kitchenMap[kitchen.id].totalQuantity += productQuantity;
        return;
      }

      compositions.forEach((comp: any) => {
        if (!comp?.kitchen || comp.kitchen.showOnKitchen === false) return;

        if (!kitchenMap[comp.kitchen.id]) {
          kitchenMap[comp.kitchen.id] = { items: [], totalQuantity: 0 };
        }

        kitchenMap[comp.kitchen.id].items.push({
          orderId: order.id,
          orderProductId: orderProduct.id,
          tableName,
          productName: product.name,
          compositionName: comp?.stockItem?.name ?? "Item",
          quantity: comp?.quantity ?? 0,
          kitchen: comp.kitchen,
          status: orderProduct.status,
          customObservation: orderProduct.customObservation,
          modifiers,
        });

        kitchenMap[comp.kitchen.id].totalQuantity += comp?.quantity ?? 0;
      });
    });

    Object.entries(kitchenMap).forEach(([kitchenId, data]) => {
      if (data.items.length > 0) {
        result.push({
          orderId: order.id,
          tableName,
          kitchenId,
          kitchen: data.items[0].kitchen,
          items: data.items,
          totalQuantity: data.totalQuantity,
        });
      }
    });
  });

  return result;
}


export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [selectedKitchenId, setSelectedKitchenId] = useState("null");
  const [loading, setLoading] = useState(true);

  const { selectedRestaurant } = useRestaurant();
  const theme = useAppTheme();

useEffect(() => {
  if (!selectedRestaurant) return;

const socket = io(process.env.EXPO_PUBLIC_API_URL as string);

  const fetchData = async () => {
    try {
      const [ordersData, kitchensData] = await Promise.all([
        getOrdersByRestaurant(selectedRestaurant.id),
        getKitchens(selectedRestaurant.id),
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setKitchens(Array.isArray(kitchensData) ? kitchensData : []);
    } catch {
      Toast.show({ type: "error", text1: "Erro ao carregar dados" });
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  socket.on("newOrder", (order: Order) => {
    if (!order?.products) return;
    setOrders((prev) => [...prev, order]);
  });
  
  return () => {
    socket.disconnect();
  };
}, [selectedRestaurant]);

  const handleProductStatus = async (orderProductId: string, status: string) => {
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
          >
            <Picker.Item label="Todas as cozinhas" value="null" />
            {kitchens
              .filter((k) => k.showOnKitchen)
              .map((k) => (
                <Picker.Item key={k.id} label={k.name} value={k.id} />
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
