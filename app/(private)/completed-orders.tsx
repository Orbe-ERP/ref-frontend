import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, RefreshControl, ScrollView, Modal, Button } from 'react-native';
import styled from 'styled-components/native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { getCompletedOrdersByDateRange, Order } from '@/services/order';
import useRestaurant from '@/hooks/useRestaurant';

export default function CompletedOrdersScreen() {
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do filtro de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showCalendarFor, setShowCalendarFor] = useState<'start' | 'end' | null>(null);

  const loadOrders = async (initial?: string, end?: string) => {
    try {
      if (!selectedRestaurant?.id) return;

      setLoading(true);
      setError(null);

      const completedOrders = await getCompletedOrdersByDateRange(
        selectedRestaurant.id,
        initial || dayjs().startOf('month').format('YYYY-MM-DD'),
        end || dayjs().endOf('month').format('YYYY-MM-DD')
      );

      setOrders(completedOrders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar comandas fechadas';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
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
    if (showCalendarFor === 'start') {
      setStartDate(day.dateString);
    } else if (showCalendarFor === 'end') {
      setEndDate(day.dateString);
    }
    setShowCalendarFor(null);
  };

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateOrderTotal = (order: Order): number =>
    order.products.reduce((total, p) => total + (p.appliedPrice || p.product.price) * p.quantity, 0) +
    (order.additional || 0);

  const renderProductItem = ({ item }: { item: Order['products'][0] }) => {
    const price = item.appliedPrice || item.product.price;
    const total = price * item.quantity;

    return (
      <ProductItem>
        <View style={{ flexDirection: 'row' }}>
          <ProductName>{item.product.name}</ProductName>
          <ProductQuantity>(x{item.quantity})</ProductQuantity>
        </View>
        <ProductPrice>{formatCurrency(total)}</ProductPrice>
      </ProductItem>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const orderTotal = calculateOrderTotal(item);

    return (
      <OrderCard>
        <OrderHeader>
          <OrderInfoContainer>
            <OrderId>Comanda #{item.id.slice(-6)}</OrderId>
            <OrderDate>{formatDate(item.updatedAt)}</OrderDate>
          </OrderInfoContainer>
        </OrderHeader>

        <OrderInfo>
          <OrderText>Mesa: {item.table.name}</OrderText>
          <OrderText>Responsável: {item.responsible || 'Não informado'}</OrderText>
          <OrderText>Pagamento: {item.paymentMethod}</OrderText>
          {item.additional && item.additional > 0 && (
            <OrderText>Taxa adicional: {formatCurrency(item.additional)}</OrderText>
          )}
        </OrderInfo>

        <FlatList
          data={item.products}
          renderItem={renderProductItem}
          keyExtractor={(p) => p.id}
          scrollEnabled={false}
        />

        <TotalContainer>
          <TotalLabel>Total:</TotalLabel>
          <TotalValue>{formatCurrency(orderTotal)}</TotalValue>
        </TotalContainer>
      </OrderCard>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Comandas Fechadas',
          headerStyle: { backgroundColor: '#041224' },
        }}
      />

      <Container>
        {/* FILTRO DE DATAS */}
        <FilterContainer>
          <DateRow>
            <DateInput onPress={() => setShowCalendarFor('start')}>
              <LabelText>De: {startDate ? dayjs(startDate).format('DD/MM/YYYY') : '--/--/----'}</LabelText>
            </DateInput>

            <DateInput onPress={() => setShowCalendarFor('end')}>
              <LabelText>Até: {endDate ? dayjs(endDate).format('DD/MM/YYYY') : '--/--/----'}</LabelText>
            </DateInput>
          </DateRow>

          <SearchButton onPress={handleSearch} disabled={loading}>
            <SearchButtonText>{loading ? 'Carregando...' : 'Buscar'}</SearchButtonText>
          </SearchButton>
        </FilterContainer>

        {/* CALENDÁRIO */}
        <Modal visible={!!showCalendarFor} transparent>
          <ModalContainer>
            <CalendarWrapper>
              <Calendar
                onDayPress={handleDateSelect}
                theme={{
                  backgroundColor: '#041224',
                  calendarBackground: '#041224',
                  textSectionTitleColor: '#ffffff',
                  dayTextColor: '#ffffff',
                  todayTextColor: '#ffd700',
                  selectedDayBackgroundColor: '#038082',
                  selectedDayTextColor: '#ffffff',
                  monthTextColor: '#ffffff',
                  arrowColor: '#ffffff',
                }}
              />
              <Button title="Fechar" onPress={() => setShowCalendarFor(null)} />
            </CalendarWrapper>
          </ModalContainer>
        </Modal>

        {/* LISTAGEM DE COMANDAS */}
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={{ color: 'white' }}>Carregando comandas...</Text>
          </LoadingContainer>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2e7d32']} />}
            ListEmptyComponent={
              <EmptyState>
                <Ionicons name="receipt-outline" size={48} color="#666" />
                <EmptyText>Nenhuma comanda encontrada no período.</EmptyText>
              </EmptyState>
            }
            contentContainerStyle={orders.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
          />
        )}
      </Container>
    </>
  );
}

/* ==== ESTILOS ==== */
const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 16px;
`;

const FilterContainer = styled.View`
  margin-bottom: 20px;
`;

const DateRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DateInput = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-width: 1px;
  border-color: #2d2d42;
  border-radius: 8px;
  margin: 0 6px;
  background-color: #1a1a2e;
`;

const LabelText = styled.Text`
  color: #ffffff;
  text-align: center;
`;

const SearchButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#083c44' : '#038082')};
  padding: 14px;
  border-radius: 8px;
  align-items: center;
`;

const SearchButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
`;

const CalendarWrapper = styled.View`
  background-color: #041224;
  border-radius: 10px;
  padding: 10px;
  elevation: 5;
`;

const OrderCard = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: #038082;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const OrderInfoContainer = styled.View``;

const OrderId = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const OrderDate = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const OrderInfo = styled.View`
  margin-bottom: 8px;
`;

const OrderText = styled.Text`
  font-size: 14px;
  color: #555;
`;

const ProductItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 4px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const ProductName = styled.Text`
  font-size: 14px;
  color: #333;
`;

const ProductQuantity = styled.Text`
  font-size: 14px;
  color: #666;
  margin-left: 8px;
`;

const ProductPrice = styled.Text`
  font-size: 14px;
  color: #333;
`;

const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
  padding-top: 8px;
`;

const TotalLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const TotalValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #2e7d32;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #fff;
  text-align: center;
  margin-top: 16px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
