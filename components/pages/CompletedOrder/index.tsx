import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import {
  getCompletedOrdersByDateRange,
  Order,
  PaginatedResponse,
} from "@/services/order";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";
import Toast from "react-native-toast-message";

export default function CompletedOrdersPage() {
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Order> | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(30, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );

  const [showCalendarFor, setShowCalendarFor] = useState<"start" | "end" | null>(null);

  const loadOrders = async (
    page: number = 1,
    sd: string = startDate,
    ed: string = endDate
  ) => {
    try {
      if (!selectedRestaurant?.id) return;

      setLoading(true);

      const response = await getCompletedOrdersByDateRange(
        selectedRestaurant.id,
        page,
        20,
        sd,
        ed,
      );

      console.log(response);

      setOrders(response.data);
      setPagination(response);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao carregar comandas.",
        position: "top",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadOrders(1);
    }
  }, [selectedRestaurant]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders(1);
  };

  const handleSearch = () => {
    loadOrders(1, startDate, endDate);
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
          <S.OrderText>Responsável: {item.responsible || "Não informado"}</S.OrderText>
          <S.OrderText>Pagamento: {item.paymentMethod}</S.OrderText>

          {item.additional && item.additional > 0 && (
            <S.OrderText>
              Taxa adicional: {formatCurrency(item.additional)}
            </S.OrderText>
          )}
        </S.OrderInfo>

        {item.products.map((p) => {
          const price = p.appliedPrice || p.product.price;
          const total = price * p.quantity;

          return (
            <S.ProductItem key={p.id}>
              <View style={{ flexDirection: "row" }}>
                <S.ProductName>{p.product.name}</S.ProductName>
                <S.ProductQuantity>(x{p.quantity})</S.ProductQuantity>
              </View>
              <S.ProductPrice>{formatCurrency(total)}</S.ProductPrice>
            </S.ProductItem>
          );
        })}

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
                De: {dayjs(startDate).format("DD/MM/YYYY")}
              </S.LabelText>
            </S.DateInput>

            <S.DateInput onPress={() => setShowCalendarFor("end")}>
              <S.LabelText>
                Até: {dayjs(endDate).format("DD/MM/YYYY")}
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
                markingType="period"
                markedDates={{
                  [startDate]: {
                    startingDay: true,
                    selected: true,
                    color: "#2BAE66",
                    textColor: "white",
                  },
                  [endDate]: {
                    endingDay: true,
                    selected: true,
                    color: "#2BAE66",
                    textColor: "white",
                  },
                }}
                theme={{
                  backgroundColor: "#041224",
                  calendarBackground: "#041224",
                  textSectionTitleColor: "#ffffff",
                  dayTextColor: "#ffffff",
                  todayTextColor: "#ffd700",
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
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <S.EmptyState>
                <Ionicons name="receipt-outline" size={48} color="#666" />
                <S.EmptyText>
                  Nenhuma comanda encontrada no período.
                </S.EmptyText>
              </S.EmptyState>
            }
            ListFooterComponent={
              pagination && pagination.totalPages > 1 ? (
                <S.PaginationContainer>
                  <TouchableOpacity
                    disabled={pagination.page <= 1}
                    onPress={() => loadOrders(pagination.page - 1)}
                  >
                    <S.PageButton disabled={pagination.page <= 1}>
                      <S.PageButtonText>← Anterior</S.PageButtonText>
                    </S.PageButton>
                  </TouchableOpacity>

                  <S.PageNumber>
                    Página {pagination.page} de {pagination.totalPages}
                  </S.PageNumber>

                  <TouchableOpacity
                    disabled={pagination.page >= pagination.totalPages}
                    onPress={() => loadOrders(pagination.page + 1)}
                  >
                    <S.PageButton disabled={pagination.page >= pagination.totalPages}>
                      <S.PageButtonText>Próxima →</S.PageButtonText>
                    </S.PageButton>
                  </TouchableOpacity>
                </S.PaginationContainer>
              ) : null
            }
          />
        )}
      </S.Container>
    </>
  );
}
