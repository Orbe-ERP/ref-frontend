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
import { Pagination } from "@/components/organisms/Pagination";
import { Loader } from "@/components/atoms/Loader";
import { useResponsive } from "@/hooks/useResponsive";

export default function CompletedOrdersPage() {
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();
  const { isTablet, isDesktop, } = useResponsive();
  const isWide = isTablet || isDesktop;

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
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/print-order",
            params: { identifier: item.identifier }
          })}
          style={{position: "absolute", top: 10, right: 10, zIndex: 10, }}
        >
          <Ionicons
            name="print-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
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
          title: "Comandas Finalizadas",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
          },
        }}
      />

      <S.Container>
        {isWide ? (
          <S.FilterContainerWide>
            <S.DateRowWide>
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

              <S.SearchButtonWide onPress={handleSearch} disabled={loading}>
                <S.SearchButtonText>
                  {"Buscar"}
                </S.SearchButtonText>
              </S.SearchButtonWide>
            </S.DateRowWide>
          </S.FilterContainerWide>
        ) : (
          <S.FilterContainerMobile>
            <S.DateRowMobile>
              <S.DateInputMobile onPress={() => setShowCalendarFor("start")}>
                <S.LabelText>
                  De: {dayjs(startDate).format("DD/MM/YYYY")}
                </S.LabelText>
              </S.DateInputMobile>

              <S.DateInputMobile onPress={() => setShowCalendarFor("end")}>
                <S.LabelText>
                  Até: {dayjs(endDate).format("DD/MM/YYYY")}
                </S.LabelText>
              </S.DateInputMobile>
            </S.DateRowMobile>

            <S.SearchButtonMobile onPress={handleSearch} disabled={loading}>
              <S.SearchButtonText>
                {"Buscar"}
              </S.SearchButtonText>
            </S.SearchButtonMobile>
          </S.FilterContainerMobile>
        )}

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

        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <S.EmptyState>
              <Ionicons 
                name="receipt-outline" 
                size={48} 
                color={theme.colors.text.secondary}
              />
              <S.EmptyText>
                {loading ? "Carregando..." : "Nenhuma comanda encontrada no período."}
              </S.EmptyText>
            </S.EmptyState>
          }
          contentContainerStyle={
            orders.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
          }
        />
        
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPrev={() => loadOrders(pagination.page - 1)}
            onNext={() => loadOrders(pagination.page + 1)}
            isLoading={loading || refreshing}
          />
        )}
        
        {loading && <Loader size="large" />}
      </S.Container>
    </>
  );
}