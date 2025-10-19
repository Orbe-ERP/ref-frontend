import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator, Alert, FlatList } from "react-native";
import styled from "styled-components/native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { getOrderSummaryByIdentifier } from "@/services/order";

export default function PrintOrderScreen() {
  const { identifier } = useLocalSearchParams<{ identifier: string }>();
  const router = useRouter();

  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!identifier) return;
    loadOrder();
  }, [identifier]);

  const loadOrder = async () => {
    try {
      const data = await getOrderSummaryByIdentifier(identifier, false);
      setOrderSummary(data);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao carregar comanda");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text>Carregando comanda...</Text>
      </LoadingContainer>
    );
  }

  if (!orderSummary) return null;

  const products = Object.values(orderSummary.totalProducts);


  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Dados da Comanda",

        }}
      />
      {/* Cabeçalho com info da comanda */}
      <Header>
        <Title>
          {orderSummary.restaurant.name} ({orderSummary.restaurant.tradeName})
        </Title>
        <Subtitle>CNPJ: {orderSummary.restaurant.cnpj}</Subtitle>
        <Subtitle>Responsável: {orderSummary.responsible}</Subtitle>
        <Subtitle>Data: {formatDate(orderSummary.createdAt)}</Subtitle>
        <Subtitle>Comanda: #{orderSummary.orderIdentifier.slice(-6)}</Subtitle>
      </Header>

      {/* Lista de produtos */}

      <FlatList
        data={products}
        keyExtractor={(item: any) => item.productId || item.id}
        renderItem={({ item }: any) => (
          <ProductItem>
          <ProductName>{item.productName}</ProductName>
            <ProductQuantity>x{item.quantity}</ProductQuantity>
            <ProductPrice>{formatCurrency(item.price)}</ProductPrice>
            <ProductTotal>{formatCurrency(item.totalPrice)}</ProductTotal>
          </ProductItem>
        )}
      />

      {/* Totais */}
      <TotalContainer>
        <TotalLabel>Subtotal:</TotalLabel>
        <TotalValue>
          {formatCurrency(
            orderSummary.totalAmount - (orderSummary.additionalAmount || 0)
          )}
        </TotalValue>
      </TotalContainer>

      {orderSummary.additionalAmount > 0 && (
        <TotalContainer>
          <TotalLabel>Taxa adicional:</TotalLabel>
          <TotalValue>
            {formatCurrency(orderSummary.additionalAmount)}
          </TotalValue>
        </TotalContainer>
      )}

      <TotalContainer>
        <TotalLabel>Total:</TotalLabel>
        <TotalValue>{formatCurrency(orderSummary.totalAmount)}</TotalValue>
      </TotalContainer>

      <PaymentContainer>
        <PaymentText>Pagamento: {orderSummary.paymentMethod}</PaymentText>
        {orderSummary.feePercent > 0 && (
          <PaymentText>Taxa percentual: {orderSummary.feePercent}%</PaymentText>
        )}
        {orderSummary.feeFixed > 0 && (
          <PaymentText>
            Taxa fixa: {formatCurrency(orderSummary.feeFixed)}
          </PaymentText>
        )}
        {orderSummary.feePaidValue > 0 && (
          <PaymentText>
            Valor da taxa paga: {formatCurrency(orderSummary.feePaidValue)}
          </PaymentText>
        )}
      </PaymentContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff;
`;

const Header = styled.View`
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #555;
  margin-top: 4px;
`;

const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProductName = styled.Text`
  flex: 2;
  font-size: 14px;
`;

const ProductQuantity = styled.Text`
  flex: 1;
  font-size: 14px;
`;

const ProductPrice = styled.Text`
  flex: 1;
  font-size: 14px;
`;

const ProductTotal = styled.Text`
  flex: 1;
  font-size: 14px;
  font-weight: bold;
`;

const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
  padding-top: 4px;
`;

const TotalLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const TotalValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #2e7d32;
`;

const PaymentContainer = styled.View`
  margin-top: 16px;
`;

const PaymentText = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
