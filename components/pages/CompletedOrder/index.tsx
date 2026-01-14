import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
import { CalendarModal } from "@/components/molecules/Calendar";

export default function CompletedOrdersPage() {
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();
  const { isTablet, isDesktop, } = useResponsive();
  const isWide = isTablet || isDesktop;

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] =
    useState<PaginatedResponse<Order> | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [startDate, setStartDate] = useState(
    dayjs().subtract(30, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [showCalendarFor, setShowCalendarFor] =
    useState<"start" | "end" | null>(null);

  async function loadOrders(
    page = 1,
    sd = startDate,
    ed = endDate
  ) {
    try {
      if (!selectedRestaurant?.id) return;

      setLoading(true);

      const response = await getCompletedOrdersByDateRange(
        selectedRestaurant.id,
        page,
        20,
        sd,
        ed
      );

      setOrders(response.data);
      setPagination(response);
    } catch {
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
  }

  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadOrders(1);
    }
  }, [selectedRestaurant?.id]);

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
    } else {
      setEndDate(day.dateString);
    }
    setShowCalendarFor(null);
  };

  const formatCurrency = (value: number): string =>
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

  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <S.OrderCard>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/print-order",
              params: { identifier: item.identifier },
            })
          }
          style={S.printButton}
        >
          <Ionicons
            name="print-outline"
            size={22}
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
          <S.OrderText>Mesa: {item.tableName}</S.OrderText>
          <S.OrderText>
            Responsável: {item.responsibles?.[0] ?? "Não informado"}
          </S.OrderText>
          <S.OrderText>Pagamento: {item.paymentMethod}</S.OrderText>

          {item.additional > 0 && (
            <S.OrderText>
              Taxa adicional: {formatCurrency(item.additional)}
            </S.OrderText>
          )}
        </S.OrderInfo>

        {item.products.map((p) => {
          const total = p.price * p.quantity;

          return (
            <S.ProductItem key={p.id}>
              <View style={{ flexDirection: "row" }}>
                <S.ProductName>{p.productName}</S.ProductName>
                <S.ProductQuantity>(x{p.quantity})</S.ProductQuantity>
              </View>

              <S.ProductPrice>
                {formatCurrency(total)}
              </S.ProductPrice>
            </S.ProductItem>
          );
        })}

        <S.TotalContainer>
          <S.TotalLabel>Total:</S.TotalLabel>
          <S.TotalValue>
            {formatCurrency(item.totalValue)}
          </S.TotalValue>
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

        <CalendarModal 
          visible={!!showCalendarFor}
          startDate={startDate}
          endDate={endDate}
          onSelectDate={handleDateSelect}
          onClose={() => setShowCalendarFor(null)}
        />

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            !loading && (
              <S.EmptyState>
                <Ionicons
                  name="receipt-outline"
                  size={48}
                  color={theme.colors.text.secondary}
                />
                <S.EmptyText>
                  Nenhuma comanda encontrada no período.
                </S.EmptyText>
              </S.EmptyState>
            )
          }
          contentContainerStyle={
            orders.length === 0 ? { flex: 1 } : { paddingBottom: 24 }
          }
        />

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPrev={() =>
              loadOrders(
                pagination.page - 1,
                startDate,
                endDate
              )
            }
            onNext={() =>
              loadOrders(
                pagination.page + 1,
                startDate,
                endDate
              )
            }
            isLoading={loading || refreshing}
          />
        )}

        {loading && orders.length === 0 && (
          <Loader size="large" />
        )}
      </S.Container>
    </>
  );
}