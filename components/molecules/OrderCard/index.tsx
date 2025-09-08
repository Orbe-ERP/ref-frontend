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
    ObsText
} from "./styles";

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
  onUpdateStatus
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
          <ItemDetails>{product.product.kitchen}</ItemDetails>
          {product.observation && <ObsText>{product.observation}</ObsText>}
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
