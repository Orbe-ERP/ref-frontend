import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Button,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { getCompletedOrdersByDateRange, Order } from "@/services/order";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";

export default function CompletedOrdersPage() {
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showCalendarFor, setShowCalendarFor] = useState<
    "start" | "end" | null
  >(null);

  const loadOrders = async (initial?: string, end?: string) => {
    try {
      if (!selectedRestaurant?.id) return;

      setLoading(true);
      setError(null);

      const completedOrders = await getCompletedOrdersByDateRange(
        selectedRestaurant.id,
        initial || dayjs().startOf("month").format("YYYY-MM-DD"),
        end || dayjs().endOf("month").format("YYYY-MM-DD")
      );

      setOrders(completedOrders);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao carregar comandas fechadas";
      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadOrders();
    }
  }, [selectedRestaurant]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders(startDate || undefined, endDate || undefined);
  };

  const handleSearch = () => {
    loadOrders(startDate || undefined, endDate || undefined);
  };

  const handleDateSelect = (day: { dateString: string }) => {
    if (showCalendarFor === "start") {
      setStartDate(day.dateString);
    } else if (showCalendarFor === "end") {
      setEndDate(day.dateString);
    }
    setShowCalendarFor(null);
  };

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string): string => {
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

  const calculateOrderTotal = (order: Order): number =>
    order.products.reduce(
      (total, p) => total + (p.appliedPrice || p.product.price) * p.quantity,
      0
    ) + (order.additional || 0);

  const renderProductItem = ({ item }: { item: Order["products"][0] }) => {
    const price = item.appliedPrice || item.product.price;
    const total = price * item.quantity;

    return (
      <S.ProductItem>
        <View style={{ flexDirection: "row" }}>
          <S.ProductName>{item.product.name}</S.ProductName>
          <S.ProductQuantity>(x{item.quantity})</S.ProductQuantity>
        </View>
        <S.ProductPrice>{formatCurrency(total)}</S.ProductPrice>
      </S.ProductItem>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const orderTotal = calculateOrderTotal(item);

    return (
      <S.OrderCard>
        <S.OrderHeader>
          <S.OrderInfoContainer>
            <S.OrderId>Comanda #{item.id.slice(-6)}</S.OrderId>
            <S.OrderDate>{formatDate(item.updatedAt)}</S.OrderDate>
          </S.OrderInfoContainer>
        </S.OrderHeader>

        <S.OrderInfo>
          <S.OrderText>Mesa: {item.table.name}</S.OrderText>
          <S.OrderText>
            Responsável: {item.responsible || "Não informado"}
          </S.OrderText>
          <S.OrderText>Pagamento: {item.paymentMethod}</S.OrderText>
          {item.additional && item.additional > 0 && (
            <S.OrderText>
              Taxa adicional: {formatCurrency(item.additional)}
            </S.OrderText>
          )}
        </S.OrderInfo>

        <FlatList
          data={item.products}
          renderItem={renderProductItem}
          keyExtractor={(p) => p.id}
          scrollEnabled={false}
        />

        <S.TotalContainer>
          <S.TotalLabel>Total:</S.TotalLabel>
          <S.TotalValue>{formatCurrency(orderTotal)}</S.TotalValue>
        </S.TotalContainer>
      </S.OrderCard>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Comandas Concluídas",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.Container>
        <S.FilterContainer>
          <S.DateRow>
            <S.DateInput onPress={() => setShowCalendarFor("start")}>
              <S.LabelText>
                De:{" "}
                {startDate
                  ? dayjs(startDate).format("DD/MM/YYYY")
                  : "--/--/----"}
              </S.LabelText>
            </S.DateInput>

            <S.DateInput onPress={() => setShowCalendarFor("end")}>
              <S.LabelText>
                Até:{" "}
                {endDate ? dayjs(endDate).format("DD/MM/YYYY") : "--/--/----"}
              </S.LabelText>
            </S.DateInput>
          </S.DateRow>

          <S.SearchButton onPress={handleSearch} disabled={loading}>
            <S.SearchButtonText>
              {loading ? "Carregando..." : "Buscar"}
            </S.SearchButtonText>
          </S.SearchButton>
        </S.FilterContainer>

        <Modal visible={!!showCalendarFor} transparent>
          <S.ModalContainer>
            <S.CalendarWrapper>
              <Calendar
                onDayPress={handleDateSelect}
                theme={{
                  backgroundColor: "#041224",
                  calendarBackground: "#041224",
                  textSectionTitleColor: "#ffffff",
                  dayTextColor: "#ffffff",
                  todayTextColor: "#ffd700",
                  selectedDayBackgroundColor: "#2BAE66",
                  selectedDayTextColor: "#ffffff",
                  monthTextColor: "#ffffff",
                  arrowColor: "#ffffff",
                }}
              />
              <Button title="Fechar" onPress={() => setShowCalendarFor(null)} />
            </S.CalendarWrapper>
          </S.ModalContainer>
        </Modal>

        {loading ? (
          <S.LoadingContainer>
            <ActivityIndicator size="large" color="#2BAE66" />
            <Text style={{ color: "white" }}>Carregando comandas...</Text>
          </S.LoadingContainer>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#2BAE66"]}
              />
            }
            ListEmptyComponent={
              <S.EmptyState>
                <Ionicons name="receipt-outline" size={48} color="#666" />
                <S.EmptyText>
                  Nenhuma comanda encontrada no período.
                </S.EmptyText>
              </S.EmptyState>
            }
            contentContainerStyle={
              orders.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
            }
          />
        )}
      </S.Container>
    </>
  );
}
