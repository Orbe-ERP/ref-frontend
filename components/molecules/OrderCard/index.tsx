import { Order } from "@/services/order";
import React from "react";
import {
  ActionButton,
  ButtonContainer,
  ButtonText,
  Card,
  CardTitle,
  ItemContainer,
  ItemDetails,
  ItemName,
  KitchenLabel,
  KitchenLabelText,
  ObsText,
} from "./styles";
import { View } from "react-native";

type Props = {
  order: Order;
  mainKitchen: string;
  kitchenColor: string;
  onUpdateStatus: (orderId: string, status: string) => void;
};

const OrderCard: React.FC<Props> = ({
  order,
  mainKitchen,
  kitchenColor,
  onUpdateStatus,
}) => {
  return (
    <Card borderColor={kitchenColor}>
      <KitchenLabel color={kitchenColor}>
        <KitchenLabelText>{mainKitchen}</KitchenLabelText>
      </KitchenLabel>

      <CardTitle>{order.table.name}</CardTitle>

      {order.products.map((product, index) => (
        <ItemContainer key={index}>
          <ItemName>{product.product.name}</ItemName>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: product.product.kitchen?.color || "#A0AEC0",
              }}
            />
            <ItemDetails>
              {product.product.kitchen?.name || "Sem Cozinha"}
            </ItemDetails>
 

                <ItemDetails>Quantidade: {product.quantity}</ItemDetails>

          </View>

          {product.observations.length > 0 && (
            <ObsText>
              {product.observations
                .map((obs) => obs.observation.description)
                .join(", ")}
            </ObsText>
          )}
        </ItemContainer>
      ))}

      <ItemDetails>Para viagem: {order.toTake ? "Sim" : "Não"}</ItemDetails>

      <ButtonContainer>
        <ActionButton
          bg="#059669"
          onPress={() => onUpdateStatus(order.id, "WORK_IN_PROGRESS")}
        >
          <ButtonText>Preparando Pedido</ButtonText>
        </ActionButton>

        <ActionButton
          bg="#d3b403"
          onPress={() => onUpdateStatus(order.id, "WAITING_DELIVERY")}
        >
          <ButtonText>Aguardando Entrega</ButtonText>
        </ActionButton>

        <ActionButton
          bg="#DC2626"
          onPress={() => onUpdateStatus(order.id, "CANCELED")}
        >
          <ButtonText>Cancelar Pedido</ButtonText>
        </ActionButton>
      </ButtonContainer>
    </Card>
  );
};

export default OrderCard;
