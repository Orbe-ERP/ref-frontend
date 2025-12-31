import React from "react";
import { View } from "react-native";
import Card from "@/components/atoms/Card";
import Title from "@/components/atoms/Title";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import KitchenLabel from "@/components/atoms/KitchenLabel";

export interface KitchenCompositionItem {
  orderId: string;
  orderProductId: string;
  tableName: string;
  productName: string;
  compositionName: string;
  quantity: number;
  kitchen: {
    id: string;
    name: string;
    color?: string;
  };
  status: string;
}

interface KitchenOrderCardProps {
  tableName: string;
  items: KitchenCompositionItem[];
  totalQuantity: number;
  onUpdateStatus: (orderProductId: string, status: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

export default function KitchenOrderCard({
  tableName,
  items,
  totalQuantity,
  onUpdateStatus,
  onCancelOrder,
}: KitchenOrderCardProps) {
  if (!items.length) return null;

  const kitchen = items[0].kitchen;
  const kitchenColor = kitchen?.color ?? "#CBD5E1";
const isPreparing = items.some(
  (item) => item.status === "WORK_IN_PROGRESS"
);

  return (
<Card
  style={{
    borderLeftWidth: 6,
    borderLeftColor: kitchenColor,
    paddingTop: 16,

    ...(isPreparing && {
      borderWidth: 2,
      borderColor: "#FACC15",
    }),
  }}
>


      <View style={{ position: "absolute", top: 8, left: 8 }}>
        <KitchenLabel color={kitchenColor}>{kitchen.name}</KitchenLabel>
      </View>
      <Title style={{ textAlign: "center", marginBottom: 4 }}>
        Mesa {tableName}
      </Title>

      <Text color="#6B7280">Pedido #{items[0].orderId.slice(0, 4)}</Text>

      {items.map((item, index) => (
        <View key={index} style={{ marginBottom: 12 }}>
          <Text weight="bold">{item.productName}</Text>
          <Text color="#6B7280" weight="bold" size={20}>
            ↳ {item.compositionName}
          </Text>
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        <Button
          hasFlex1
          label="Preparar"
          variant="secondary"
          onPress={() =>
            items.forEach((item) =>
              onUpdateStatus(item.orderProductId, "WORK_IN_PROGRESS")
            )
          }
        />

        <Button
          hasFlex1
          label="Pedido Pronto"
          variant="primary"
          onPress={() =>
            items.forEach((item) =>
              onUpdateStatus(item.orderProductId, "WAITING_DELIVERY")
            )
          }
        />

        {onCancelOrder && (
          <Button
            hasFlex1
            label="Cancelar Pedido"
            variant="danger"
            onPress={() => onCancelOrder(items[0].orderId)}
          />
        )}
      </View>
    </Card>
  );
}
