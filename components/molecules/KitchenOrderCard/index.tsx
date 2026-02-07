import React, { useMemo, useState } from "react";
import { View } from "react-native";
import Card from "@/components/atoms/Card";
import Title from "@/components/atoms/Title";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import KitchenLabel from "@/components/atoms/KitchenLabel";
import ConfirmActionModal from "../ConfirmModal";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export interface KitchenCompositionItem {
  orderId: string;
  orderProductId: string;
  tableName: string;
  productName: string;
  productQuantity: number;
  compositionName: string;
  compositionQuantity: number;
  kitchen: {
    id: string;
    name: string;
    color?: string;
  };
  status: string;
  customObservation?: string;
  modifiers: any;
}

type ModalType = "prepare" | "ready" | "cancel" | null;

interface KitchenOrderCardProps {
  tableName: string;
  items: KitchenCompositionItem[];
  onUpdateStatus: (orderProductId: string, status: string) => void;
  onCancelOrder?: (orderProductId: string) => void;
}

export default function KitchenOrderCard({
  tableName,
  items,
  onUpdateStatus,
  onCancelOrder,
}: KitchenOrderCardProps) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const { theme } = useAppTheme();

  if (!items.length) return null;

  const kitchen = items[0].kitchen;
  const kitchenColor = kitchen?.color ?? "#CBD5E1";

  const products = useMemo(() => {
    const grouped: Record<string, any> = {};

    items.forEach((item) => {
      if (!grouped[item.orderProductId]) {
        grouped[item.orderProductId] = {
          orderProductId: item.orderProductId,
          orderId: item.orderId,
          productName: item.productName,
          productQuantity: item.productQuantity,
          status: item.status,
          compositions: [],
          customObservation: item.customObservation,
        };
      }

      grouped[item.orderProductId].compositions.push({
        name: item.compositionName,
        quantity: item.compositionQuantity,
      });
    });

    return Object.values(grouped);
  }, [items]);

  const isPreparing = products.some((p) => p.status === "WORK_IN_PROGRESS");

  const handleConfirm = () => {
    if (modalType === "prepare") {
      products.forEach((product) =>
        onUpdateStatus(product.orderProductId, "WORK_IN_PROGRESS"),
      );
    }

    if (modalType === "ready") {
      products.forEach((product) =>
        onUpdateStatus(product.orderProductId, "WAITING_DELIVERY"),
      );
    }

    if (modalType === "cancel" && onCancelOrder) {
      onCancelOrder(products[0].orderProductId);
    }

    setModalType(null);
  };

  return (
    <>
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
          {tableName}
        </Title>

        <Text color="#6B7280">Pedido #{products[0].orderId.slice(0, 4)}</Text>

        {products.map((product) => (
          <View key={product.orderProductId} style={{ marginBottom: 16 }}>
            <Text size={24} color={theme.colors.primary} weight="bold">
              {product.productQuantity}x - {product.productName}
            </Text>

            {product.compositions.map((comp: any, index: any) => (
              <Text
                key={index}
                size={20}
                color={theme.colors.feedback.warning}
                weight="bold"
              >
                ↳ {comp.quantity}x - {comp.name}
              </Text>
            ))}

            {product.customObservation && (
              <Text color="#6B7280">
                Observação: {product.customObservation}
              </Text>
            )}
          </View>
        ))}

        <View style={{ marginTop: 8 }}>
          <Button
            label="Preparar"
            variant="secondary"
            onPress={() => setModalType("prepare")}
          />
          <Button
            label="Pedido Pronto"
            variant="primary"
            onPress={() => setModalType("ready")}
          />
          {onCancelOrder && (
            <Button
              label="Cancelar Pedido"
              variant="danger"
              onPress={() => setModalType("cancel")}
            />
          )}
        </View>
      </Card>

      {modalType && (
        <ConfirmActionModal
          visible
          title={
            modalType === "prepare"
              ? "Iniciar preparo?"
              : modalType === "ready"
                ? "Pedido pronto?"
                : "Cancelar pedido?"
          }
          description="Essa ação será aplicada a todos os itens deste prato."
          confirmLabel="Confirmar"
          variant={
            modalType === "cancel"
              ? "danger"
              : modalType === "ready"
                ? "primary"
                : "secondary"
          }
          onCancel={() => setModalType(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
