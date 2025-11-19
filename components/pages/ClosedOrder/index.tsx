import { Pagination } from "@/components/organisms/Pagination";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { getCompletedOrdersByTable, Order } from "@/services/order";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { 
  ActivityIndicator, 
  FlatList, 
  RefreshControl, 
  Modal, 
  Button 
} from "react-native";
import Toast from "react-native-toast-message";
import * as S from "./styles";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

export default function ClosedOrdersPage() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useAppTheme();

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [showCalendarFor, setShowCalendarFor] = useState<"start" | "end" | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printing, setPrinting] = useState(false);

  const loadOrders = async (pageNum = 1, sd: string = startDate, ed: string = endDate) => {
    try {
      if (!tableId || typeof tableId !== "string")
        throw new Error("ID da mesa não encontrado");

      setError(null);
      setLoading(true);

      const response = await getCompletedOrdersByTable(tableId, pageNum, sd, ed);
      console.log(response);

      setOrders(response.data);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao carregar comandas fechadas";

      setError(message);
      Toast.show({
        type: "error",
        text1: "Erro ao carregar comandas",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (tableId) loadOrders(1);
  }, [tableId]);

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

  const handlePrintOrder = (order: Order) => {
    router.push({
      pathname: "/print-order",
      params: { identifier: order.identifier },
    });
  };

  const confirmPrint = async () => {
    if (!selectedOrder) return;

    setPrinting(true);
    try {
      await printOrder(selectedOrder);

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Comanda enviada para impressão!",
        position: "top",
        visibilityTime: 2000,
      });
      setShowPrintModal(false);
      setSelectedOrder(null);
    } catch {
      Toast.show({
        type: "error",
        text1: "Falha ao imprimir comanda. Tente novamente.",
      });
    } finally {
      setPrinting(false);
    }
  };

  const printOrder = async (order: Order) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log("Imprimindo comanda:", order.id);
        resolve(true);
      }, 1000);
    });

  const calculateOrderTotal = (order: Order) =>
    order.products.reduce((total, product) => {
      const price = product.appliedPrice || product.product.price;
      return total + price * product.quantity;
    }, 0) + (order.additional || 0);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR") +
    " " +
    new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const renderProductItem = ({ item }: { item: Order["products"][0] }) => {
    const price = item.appliedPrice || item.product.price;
    const total = price * item.quantity;

    return (
      <S.ProductItem>
        <S.ProductInfo>
          <S.ProductName>{item.product.name}</S.ProductName>
          <S.ProductQuantity>(x{item.quantity})</S.ProductQuantity>
        </S.ProductInfo>
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
          <S.PrintButton onPress={() => handlePrintOrder(item)}>
            <Ionicons
              name="print-outline"
              size={20}
              color={theme.colors.surface}
            />
          </S.PrintButton>
        </S.OrderHeader>

        <S.OrderInfo>
          <S.OrderText>Mesa: {item.table.name}</S.OrderText>
          <S.OrderText>
            Responsável: {item.responsible || "Não informado"}
          </S.OrderText>
          <S.OrderText>Pagamento: {item.paymentMethod}</S.OrderText>
          {item.additional && (
            <S.OrderText>
              Taxa adicional: {formatCurrency(item.additional)}
            </S.OrderText>
          )}
        </S.OrderInfo>

        <S.ProductsList>
          <FlatList
            data={item.products}
            renderItem={renderProductItem}
            keyExtractor={(product) => product.id}
            scrollEnabled={false}
          />
        </S.ProductsList>

        <S.TotalContainer>
          <S.TotalLabel>Total:</S.TotalLabel>
          <S.TotalValue>{formatCurrency(orderTotal)}</S.TotalValue>
        </S.TotalContainer>
      </S.OrderCard>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <S.LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </S.LoadingContainer>
    );
  }

  return (
    <S.ScreenContainer>
      <Stack.Screen
        options={{
          title: "Comandas Fechadas",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      {/* Filtro de Data */}
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

      {/* Modal do Calendário */}
      <Modal visible={!!showCalendarFor} transparent animationType="fade">
        <S.ModalOverlay>
          <S.CalendarWrapper>
            <Calendar
              onDayPress={handleDateSelect}
              markingType="period"
              markedDates={{
                [startDate]: {
                  startingDay: true,
                  selected: true,
                  color: theme.colors.primary,
                  textColor: "white",
                },
                [endDate]: {
                  endingDay: true,
                  selected: true,
                  color: theme.colors.primary,
                  textColor: "white",
                },
              }}
              theme={{
                backgroundColor: theme.colors.background,
                calendarBackground: theme.colors.background,
                textSectionTitleColor: theme.colors.text.primary,
                dayTextColor: theme.colors.text.primary,
                todayTextColor: theme.colors.primary,
                selectedDayTextColor: "white",
                monthTextColor: theme.colors.text.primary,
                arrowColor: theme.colors.text.primary,
              }}
            />
            <Button 
              title="Fechar" 
              onPress={() => setShowCalendarFor(null)} 
              color={theme.colors.primary}
            />
          </S.CalendarWrapper>
        </S.ModalOverlay>
      </Modal>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
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
              {loading ? "Carregando..." : "Nenhuma comanda fechada encontrada\npara esta mesa no período selecionado."}
            </S.EmptyText>
          </S.EmptyState>
        }
        contentContainerStyle={
          orders.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
        }
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => loadOrders(page - 1, startDate, endDate)}
        onNext={() => loadOrders(page + 1, startDate, endDate)}
        isLoading={loading}
      />

      {showPrintModal && selectedOrder && (
        <S.ModalOverlay>
          <S.PrintModal>
            <S.ModalTitle>Imprimir Comanda</S.ModalTitle>
            <S.ModalText>
              Deseja imprimir a comanda #{selectedOrder.id.slice(-6)}?
            </S.ModalText>
            <S.ModalText>Mesa: {selectedOrder.table.name}</S.ModalText>
            <S.ModalText>
              Total: {formatCurrency(calculateOrderTotal(selectedOrder))}
            </S.ModalText>

            <S.ModalButtons>
              <S.CancelButton
                onPress={() => {
                  setShowPrintModal(false);
                  setSelectedOrder(null);
                }}
                disabled={printing}
              >
                <S.ButtonText>Cancelar</S.ButtonText>
              </S.CancelButton>

              <S.PrintButtonModal onPress={confirmPrint} disabled={printing}>
                {printing ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.surface}
                  />
                ) : (
                  <S.ButtonText>Imprimir</S.ButtonText>
                )}
              </S.PrintButtonModal>
            </S.ModalButtons>
          </S.PrintModal>
        </S.ModalOverlay>
      )}
    </S.ScreenContainer>
  );
}