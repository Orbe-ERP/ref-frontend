import React, { useState } from "react";
import { View } from "react-native";
import Card from "@/components/atoms/Card";
import Title from "@/components/atoms/Title";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import KitchenLabel from "@/components/atoms/KitchenLabel";
import ConfirmActionModal from "../ConfirmModal";

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
  customObservation?: string;
  modifiers?: {
    modifierId: string;
    name: string;
    quantity: number;
    textValue?: string;
  }[];
}

type ModalType = "prepare" | "ready" | "cancel" | null;

interface KitchenOrderCardProps {
  tableName: string;
  items: KitchenCompositionItem[];
  totalQuantity: number;
  onUpdateStatus: (orderProductId: string, status: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

const MODAL_CONFIG: Record<
  Exclude<ModalType, null>,
  {
    title: string;
    description: string;
    confirmLabel: string;
    variant: "primary" | "secondary" | "danger";
  }
> = {
  prepare: {
    title: "Iniciar preparo?",
    description: "Isso marcará como em preparo todos itens desse prato.",
    confirmLabel: "Sim, preparar",
    variant: "secondary",
  },
  ready: {
    title: "Pedido pronto?",
    description: "O prato será marcado como pronto para entrega ao cliente.",
    confirmLabel: "Sim, finalizar",
    variant: "primary",
  },
  cancel: {
    title: "Cancelar pedido?",
    description:
      "Essa ação irá cancelar o prato inteiro e não poderá ser desfeito.",
    confirmLabel: "Sim, cancelar",
    variant: "danger",
  },
};

export default function KitchenOrderCard({
  tableName,
  items,
  totalQuantity,
  onUpdateStatus,
  onCancelOrder,
}: KitchenOrderCardProps) {
  const [modalType, setModalType] = useState<ModalType>(null);

  if (!items.length) return null;

  const kitchen = items[0].kitchen;
  const kitchenColor = kitchen?.color ?? "#CBD5E1";

  const isPreparing = items.some((item) => item.status === "WORK_IN_PROGRESS");

  const handleConfirm = () => {
    if (modalType === "prepare") {
      items.forEach((item) =>
        onUpdateStatus(item.orderProductId, "WORK_IN_PROGRESS")
      );
    }

    if (modalType === "ready") {
      items.forEach((item) =>
        onUpdateStatus(item.orderProductId, "WAITING_DELIVERY")
      );
    }

    if (modalType === "cancel" && onCancelOrder) {
      onCancelOrder(items[0].orderProductId);
    }

    setModalType(null);
  };

  const modalConfig = modalType ? MODAL_CONFIG[modalType] : null;

  return (
    <>
      <Card
        style={{
          borderLeftWidth: 6,
          borderLeftColor: kitchenColor,
          paddingTop: 16,
          ...(isPreparing && { borderWidth: 2, borderColor: "#FACC15" }),
        }}
      >
        <View style={{ position: "absolute", top: 8, left: 8 }}>
          <KitchenLabel color={kitchenColor}>{kitchen.name}</KitchenLabel>
        </View>

        <Title style={{ textAlign: "center", marginBottom: 4 }}>
          {tableName}
        </Title>
        <Text color="#6B7280">Pedido #{items[0].orderId.slice(0, 4)}</Text>

        {items.map((item, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <Text weight="bold">{item.productName}</Text>
            <Text color="#6B7280" weight="bold" size={20}>
              ↳ {item.compositionName} x{item.quantity}
            </Text>

            {item.customObservation && (
              <Text color="#6B7280">Observação: {item.customObservation}</Text>
            )}

            {item.modifiers && item.modifiers.length > 0 && (
              <View>
                {item.modifiers.map((m, i) => (
                  <Text key={i} color="#F97316">
                    {m.name} {m.quantity > 1 ? `x${m.quantity}` : ""}
                    {m.textValue ? ` (${m.textValue})` : ""}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={{ flexDirection: "column", marginTop: 8 }}>
          <Button
            hasFlex1
            label="Preparar"
            variant="secondary"
            onPress={() => setModalType("prepare")}
          />
          <Button
            hasFlex1
            label="Pedido Pronto"
            variant="primary"
            onPress={() => setModalType("ready")}
          />
          {onCancelOrder && (
            <Button
              hasFlex1
              label="Cancelar Pedido"
              variant="danger"
              onPress={() => setModalType("cancel")}
            />
          )}
        </View>
      </Card>

      {modalConfig && (
        <ConfirmActionModal
          visible
          title={modalConfig.title}
          description={modalConfig.description}
          confirmLabel={modalConfig.confirmLabel}
          variant={modalConfig.variant}
          onCancel={() => setModalType(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
