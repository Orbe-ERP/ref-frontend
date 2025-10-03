import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import {
  Card,
  Header,
  Title,
  ItemContainer,
  ItemDetails,
  ItemHeader,
  ItemName,
  ItemObservations,
  ActionsHeader,
  EditButton,
  ObservationRow,
  ObservationDeleteButton,
  ObservationText,
  ProductActions,
  ActionButton,
  ActionText,
  ModalActions,
  Dot,
  ModalContainer,
  ModalContent,
  ModalTitle,
  AddButton,
  CancelButtonStyled,
  QtyButton,
  QtyText,
  QuantityContainer,
  ConfirmButton,
  ConfirmText,
  CancelButton,
  CancelText,
  AddText,
  WorkInProgressButtonSyled,
} from "./styles";

interface Product {
  id: string;
  product: { name: string; kitchen?: { name: string; color: string } };
  quantity: number;
  status: string;
  observations: any[];
}

interface Order {
  id: string;
  table: { name: string };
  status: string;
  products: Product[];
  toTake?: boolean;
}

interface Props {
  order: Order;
  handleProductStatus: (id: string, status: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  confirmDeleteObservation?: (productId: string, observationId: string) => void;
}

export default function OrderCard({
  order,
  handleProductStatus,
  onUpdateQuantity,
  confirmDeleteObservation,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductName("");
    setQuantity("1");
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.product.name);
    setQuantity(product.quantity.toString());
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (editingProduct) {
      onUpdateQuantity?.(editingProduct.id, Number(quantity));
      setModalVisible(false);
    }
  };

  return (
    <Card>
      <Header>
        <Title>{order.table.name}</Title>
      </Header>

      {order.products
        .filter((p) => p.status !== "CANCELED" || "COMPLETED")
        .map((p) => (
          <ItemContainer
            key={p.id}
            borderColor={p.product.kitchen?.color || "#475569"}
            preparing={p.status === "WORK_IN_PROGRESS"}
          >
            <ItemHeader>
              <ItemName>{p.product.name}</ItemName>
              <ActionsHeader>
                <EditButton onPress={() => handleEditProduct(p)}>
                  <Ionicons name="create-outline" size={18} color="#3b82f6" />
                </EditButton>
              </ActionsHeader>
            </ItemHeader>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <Dot color={p.product.kitchen?.color || "#A0AEC0"} />
              <ItemDetails>
                {p.product.kitchen?.name || "Sem cozinha"}
              </ItemDetails>
              <ItemDetails>Qtd: {p.quantity}</ItemDetails>
            </View>
            {p.observations.length > 0 && (
              <ItemObservations>
                Observaçoes:
                {p.observations.map((obs) => (
                  <ObservationRow key={obs.id}>
                    <ObservationText>
                      {obs.observation?.description || obs.description}
                    </ObservationText>
                    <ObservationDeleteButton
                      onPress={() => confirmDeleteObservation?.(p.id, obs.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#ef4444"
                      />
                    </ObservationDeleteButton>
                  </ObservationRow>
                ))}
              </ItemObservations>
            )}

            <ProductActions>
              <WorkInProgressButtonSyled
                onPress={() => handleProductStatus(p.id, "WORK_IN_PROGRESS")}
              >
                <Ionicons name="time-outline" size={16} color="#fff" />
                <ActionText>Preparar</ActionText>
              </WorkInProgressButtonSyled>

              <ActionButton
                onPress={() => handleProductStatus(p.id, "COMPLETED")}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={16}
                  color="#fff"
                />
                <ActionText>Concluir</ActionText>
              </ActionButton>

              <CancelButtonStyled
                onPress={() => handleProductStatus(p.id, "CANCELED")}
              >
                <Ionicons name="close-circle-outline" size={16} color="#fff" />
                <ActionText>Cancelar</ActionText>
              </CancelButtonStyled>
            </ProductActions>
          </ItemContainer>
        ))}


      {modalVisible && editingProduct && (
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Editar Quantidade</ModalTitle>

            <QuantityContainer>
              <QtyButton
                onPress={() =>
                  setQuantity((prev) => String(Math.max(1, Number(prev) - 1)))
                }
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={28}
                  color="#ef4444"
                />
              </QtyButton>

              <QtyText>{quantity}</QtyText>

              <QtyButton
                onPress={() => setQuantity((prev) => String(Number(prev) + 1))}
              >
                <Ionicons name="add-circle-outline" size={28} color="#22c55e" />
              </QtyButton>
            </QuantityContainer>

            <ModalActions>
              <CancelButton onPress={() => setModalVisible(false)}>
                <CancelText>Cancelar</CancelText>
              </CancelButton>
              <ConfirmButton
                onPress={() => {
                  confirmAction();
                  setModalVisible(false);
                }}
              >
                <ConfirmText>Confirmar</ConfirmText>
              </ConfirmButton>
            </ModalActions>
          </ModalContent>
        </ModalContainer>
      )}
    </Card>
  );
}
