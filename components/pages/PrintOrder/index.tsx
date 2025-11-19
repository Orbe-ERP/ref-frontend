import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Alert } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Button from "@/components/atoms/Button"; 
import { getOrderSummaryByIdentifier } from "@/services/order";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";

export default function PrintOrderScreen() {
  const { identifier } = useLocalSearchParams<{ identifier: string }>();
  const router = useRouter();
  const theme = useAppTheme();

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
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao carregar comanda.",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    Toast.show({
      type: "info",
      text1: "Imprimindo...",
      text2: "Funcionalidade em desenvolvimento",
    });
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
      " - " +
      date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return (
      <S.LoadingContainer>
        <ActivityIndicator size="large" color={theme.theme.colors.primary} />
        <S.LoadingText>Carregando comanda...</S.LoadingText>
      </S.LoadingContainer>
    );
  }

  if (!orderSummary) return null;

  const products = Object.values(orderSummary.totalProducts);
  const subtotal = orderSummary.totalAmount - (orderSummary.additionalAmount || 0);

  return (
    <S.Container>
      <Stack.Screen
        options={{
          title: "Detalhes da Comanda",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
          headerShadowVisible: false,
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <S.TicketCard>
          <S.Header>
            <S.RestaurantTitle>{orderSummary.restaurant.name}</S.RestaurantTitle>
            <S.Subtitle>{orderSummary.restaurant.tradeName}</S.Subtitle>
            <S.MetaInfo>CNPJ: {orderSummary.restaurant.cnpj}</S.MetaInfo>
            <S.Divider />
            
            <S.RowInfo>
              <S.Label>Comanda:</S.Label>
              <S.Value>#{orderSummary.orderIdentifier.slice(-6)}</S.Value>
            </S.RowInfo>
            <S.RowInfo>
              <S.Label>Data:</S.Label>
              <S.Value>{formatDate(orderSummary.createdAt)}</S.Value>
            </S.RowInfo>
            <S.RowInfo>
              <S.Label>Responsável:</S.Label>
              <S.Value>{orderSummary.responsible}</S.Value>
            </S.RowInfo>
          </S.Header>

          <S.SectionTitle>Itens do Pedido</S.SectionTitle>
          
          {products.map((item: any) => (
            <S.ProductRow key={item.productId || item.id}>
              <S.QuantityBox>
                <S.QuantityText>{item.quantity}x</S.QuantityText>
              </S.QuantityBox>
              
              <S.ProductInfo>
                <S.ProductName>{item.productName}</S.ProductName>
                <S.ProductUnitVal>{formatCurrency(item.price)}</S.ProductUnitVal>
              </S.ProductInfo>

              <S.ProductTotal>{formatCurrency(item.totalPrice)}</S.ProductTotal>
            </S.ProductRow>
          ))}

          <S.Divider dashed />

          <S.SummaryContainer>
            <S.RowSummary>
              <S.SummaryLabel>Subtotal</S.SummaryLabel>
              <S.SummaryValue>{formatCurrency(subtotal)}</S.SummaryValue>
            </S.RowSummary>

            {orderSummary.additionalAmount > 0 && (
              <S.RowSummary>
                <S.SummaryLabel>Taxa Adicional</S.SummaryLabel>
                <S.SummaryValue>{formatCurrency(orderSummary.additionalAmount)}</S.SummaryValue>
              </S.RowSummary>
            )}

            <S.TotalRow>
              <S.TotalLabel>TOTAL</S.TotalLabel>
              <S.TotalValue>{formatCurrency(orderSummary.totalAmount)}</S.TotalValue>
            </S.TotalRow>
          </S.SummaryContainer>

          <S.FooterInfo>
            <S.PaymentTitle>Pagamento</S.PaymentTitle>
            <S.PaymentInfo>Método: {orderSummary.paymentMethod}</S.PaymentInfo>
            {orderSummary.feePercent > 0 && (
               <S.MetaInfo>Taxa Serviço: {orderSummary.feePercent}%</S.MetaInfo>
            )}
          </S.FooterInfo>
        </S.TicketCard>
      </ScrollView>

      {/* Botão fixo no rodapé */}
      <S.BottomButtonContainer>
        <Button
          label="Imprimir Comanda"
          variant="primary" // Ou 'secondary' se preferir verde igual ao carrinho
          onPress={handlePrint}
          // icon={<Ionicons name="print-outline" size={20} color="#fff" />}
        />
      </S.BottomButtonContainer>
    </S.Container>
  );
}