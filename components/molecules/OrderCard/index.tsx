import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Order } from "@/services/order";

interface Props {
  order: Order;
  additional: number;
  onChangeAdditional: (val: number) => void;
  onPaymentSelect: (orderId: string, method: string) => void;
  onConclude: () => void;
}

const Card = styled.View`
  background-color: #041b38;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Text = styled.Text`
  color: #fff;
  font-size: 14px;
  margin-bottom: 4px;
`;

const ProductText = styled.Text`
  color: #94a3b8;
  font-size: 14px;
`;

const PaymentOptions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
`;

const PaymentButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? "#038082" : "#e9ecef")};
  padding: 10px;
  border-radius: 6px;
  flex-basis: 48%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const PaymentText = styled.Text<{ selected: boolean }>`
  margin-left: 6px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ selected }) => (selected ? "#fff" : "#6c757d")};
`;

const ConcludeButton = styled.TouchableOpacity`
  background-color: #038082;
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
`;

const ConcludeText = styled.Text`
  color: #fff;
  text-align: center;
  font-weight: bold;
`;

const Input = styled.TextInput`
  background-color: #fff;
  border-radius: 6px;
  padding: 8px;
  margin-top: 8px;
  font-size: 16px;
`;

export default function OrderCard({
  order,
  additional,
  onChangeAdditional,
  onPaymentSelect,
  onConclude,
}: Props) {
  const total = order.products.reduce(
    (sum, p) => sum + p.product.price * p.quantity,
    0
  );

  // Aqui já tipamos o `icon` corretamente
  const methods: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { key: "PIX", icon: "cash-outline", label: "PIX" },
    { key: "CASH", icon: "wallet-outline", label: "Dinheiro" },
    { key: "CREDIT_CARD", icon: "card-outline", label: "Crédito" },
    { key: "DEBIT_CARD", icon: "card-sharp", label: "Débito" },
  ];

  return (
    <Card>
      <Title>Responsável: {order.responsible}</Title>
      <Text>Status: {order.status}</Text>

      {order.products.map((p) => (
        <ProductText key={p.productId}>
          {p.product.name} x{p.quantity} - R$ {p.product.price}
        </ProductText>
      ))}

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Total: R$ {total.toFixed(2)}
      </Text>

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Método de pagamento:
      </Text>
      <PaymentOptions>
        {methods.map((m) => (
          <PaymentButton
            key={m.key}
            selected={order.paymentMethod === m.key}
            onPress={() => onPaymentSelect(order.id, m.key)}
          >
            <Ionicons
              name={m.icon}
              size={20}
              color={order.paymentMethod === m.key ? "#fff" : "#aaa"}
            />
            <PaymentText selected={order.paymentMethod === m.key}>
              {m.label}
            </PaymentText>
          </PaymentButton>
        ))}
      </PaymentOptions>

      <Text style={{ color: "#fff", marginTop: 10 }}>Adicional (%)</Text>
      <Input
        keyboardType="numeric"
        value={String(additional)}
        onChangeText={(text: string) =>
          onChangeAdditional(Math.min(100, Math.max(0, Number(text) || 0)))
        }
      />

      <ConcludeButton onPress={onConclude}>
        <ConcludeText>Concluir comanda</ConcludeText>
      </ConcludeButton>
    </Card>
  );
}
