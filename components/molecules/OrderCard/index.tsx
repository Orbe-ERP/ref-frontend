import { Ionicons } from "@expo/vector-icons";
import { ActionButton, ActionsHeader, ActionText, CancelButtonStyled, Card, EditButton, ItemContainer, ItemDetails, ItemHeader, ItemName, ItemObservations, ObservationDeleteButton, ObservationRow, ObservationText, ProductActions, Title, WorkInProgressButtonSyled } from "./styles";
import { useState } from "react";

interface Props {
  tableName: string;
  items: KitchenItem[];

  onUpdateStatus: (orderProductId: string, status: string) => void;
  onUpdateQuantity?: (orderProductId: string, quantity: number) => void;

  onDeleteObservation?: (orderProductId: string, obsId: string) => void;
  onDeleteCustomObservation?: (orderProductId: string) => void;

  onCancelItem?: (orderProductId: string) => void;
}
export type KitchenItem = {
  orderId: string;
  tableName: string;

  orderProductId: string;
  productName: string;

  composition: {
    id?: string;
    kitchen: {
      id: string;
      name: string;
      color: string;
    };
    quantity: number;
    unit: string;
  };

  quantity: number;
  status: string;

  observations: any[];
  customObservation?: string;
};


export default function KitchenOrderCard({
  tableName,
  items,
  onUpdateStatus,
  onUpdateQuantity,
  onDeleteObservation,
  onDeleteCustomObservation,
  onCancelItem,
}: Props) {
  const [editingItem, setEditingItem] = useState<KitchenItem | null>(null);
  const [quantity, setQuantity] = useState("1");

  const openEditQuantity = (item: KitchenItem) => {
    setEditingItem(item);
    setQuantity(item.quantity.toString());
  };

  return (
    <Card>
      <Title>Mesa {tableName}</Title>

      {items.map((item) => (
        <ItemContainer
          key={item.orderProductId + item.composition.kitchen.id}
          borderColor={item.composition.kitchen.color}
          preparing={item.status === "WORK_IN_PROGRESS"}
        >
          <ItemHeader>
            <ItemName>{item.productName}</ItemName>

            <ActionsHeader>
              <EditButton onPress={() => openEditQuantity(item)}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={item.composition.kitchen.color}
                />
              </EditButton>
            </ActionsHeader>
          </ItemHeader>

          <ItemDetails>
            Quantidade: {item.quantity}
          </ItemDetails>

          {(item.observations.length > 0 || item.customObservation) && (
            <ItemObservations>
              <Title>Observações</Title>

              {item.observations.map((obs) => (
                <ObservationRow key={obs.id}>
                  <ObservationText>
                    • {obs.observation?.description || obs.description}
                  </ObservationText>

                  <ObservationDeleteButton
                    onPress={() =>
                      onDeleteObservation?.(item.orderProductId, obs.id)
                    }
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </ObservationDeleteButton>
                </ObservationRow>
              ))}

              {item.customObservation && (
                <ObservationRow>
                  <ObservationText>• {item.customObservation}</ObservationText>
                  <ObservationDeleteButton
                    onPress={() =>
                      onDeleteCustomObservation?.(item.orderProductId)
                    }
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </ObservationDeleteButton>
                </ObservationRow>
              )}
            </ItemObservations>
          )}

          <ProductActions>
            <WorkInProgressButtonSyled
              onPress={() =>
                onUpdateStatus(item.orderProductId, "WORK_IN_PROGRESS")
              }
            >
              <Ionicons name="time-outline" size={16} color="#fff" />
              <ActionText>Preparar</ActionText>
            </WorkInProgressButtonSyled>

            <ActionButton
              onPress={() =>
                onUpdateStatus(item.orderProductId, "COMPLETED")
              }
            >
              <Ionicons name="checkmark-done-outline" size={16} color="#fff" />
              <ActionText>Concluir</ActionText>
            </ActionButton>

            <CancelButtonStyled
              onPress={() => onCancelItem?.(item.orderProductId)}
            >
              <Ionicons name="close-circle-outline" size={16} color="#fff" />
              <ActionText>Cancelar</ActionText>
            </CancelButtonStyled>
          </ProductActions>
        </ItemContainer>
      ))}
    </Card>
  );
}
