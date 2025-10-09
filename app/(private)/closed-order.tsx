import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCompletedOrdersByTable, Order } from '@/services/order';


export default function ClosedOrdersScreen() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printing, setPrinting] = useState(false);

  const loadCompletedOrders = async () => {
    try {
      if (!tableId || typeof tableId !== 'string') {
        throw new Error('ID da mesa não encontrado');
      }

      setError(null);
      const completedOrders = await getCompletedOrdersByTable(tableId);

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
    if (tableId) {
      loadCompletedOrders();
    }
  }, [tableId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCompletedOrders();
  };

  const handlePrintOrder = async (order: Order) => {
    setSelectedOrder(order);
    setShowPrintModal(true);
  };

  const confirmPrint = async () => {
    if (!selectedOrder) return;

    setPrinting(true);
    try {
      // Aqui você vai integrar com sua função de impressão
      await printOrder(selectedOrder);
      
      Alert.alert('Sucesso', 'Comanda enviada para impressão!');
      setShowPrintModal(false);
      setSelectedOrder(null);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao imprimir comanda. Tente novamente.');
    } finally {
      setPrinting(false);
    }
  };

  const printOrder = async (order: Order) => {
    // Implemente aqui a lógica de impressão
    // Isso pode variar dependendo da sua biblioteca de impressão
    
    // Exemplo com react-native-esc-pos (caso esteja usando)
    /*
    const printResult = await EscPos.printReceipt({
      orderId: order.id,
      products: order.products,
      total: calculateOrderTotal(order),
      table: order.table.name,
      date: order.updatedAt
    });
    return printResult;
    */
    
    // Por enquanto, vamos simular uma impressão
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Imprimindo comanda:', order.id);
        resolve(true);
      }, 1000);
    });
  };

  const calculateOrderTotal = (order: Order): number => {
    return order.products.reduce((total, product) => {
      const price = product.appliedPrice || product.product.price;
      return total + (price * product.quantity);
    }, 0) + (order.additional || 0);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const renderProductItem = ({ item }: { item: Order['products'][0] }) => {
    const price = item.appliedPrice || item.product.price;
    const total = price * item.quantity;

    return (
      <ProductItem>
        <View style={{ flex: 1, flexDirection: 'row' }}>
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
      <>
        <Stack.Screen
          options={{
            title: 'Comandas Fechadas',
            headerStyle: { 
              backgroundColor: "#041224"
            },
          }}
        />
        <OrderCard>
          <OrderHeader>
            <OrderInfoContainer>
              <OrderId>Comanda #{item.id.slice(-6)}</OrderId>
              <OrderDate>{formatDate(item.updatedAt)}</OrderDate>
            </OrderInfoContainer>
            <PrintButton onPress={() => handlePrintOrder(item)}>
              <Ionicons name="print-outline" size={20} color="white" />
            </PrintButton>
          </OrderHeader>

          <OrderInfo>
            <OrderText>Mesa: {item.table.name}</OrderText>
            <OrderText>Responsável: {item.responsible || 'Não informado'}</OrderText>
            <OrderText>Pagamento: {item.paymentMethod}</OrderText>
            {item.additional && item.additional > 0 && (
              <OrderText>Taxa adicional: {formatCurrency(item.additional)}</OrderText>
            )}
          </OrderInfo>

          <ProductsList>
            <FlatList
              data={item.products}
              renderItem={renderProductItem}
              keyExtractor={(product) => product.id}
              scrollEnabled={false}
            />
          </ProductsList>

          <TotalContainer>
            <TotalLabel>Total:</TotalLabel>
            <TotalValue>{formatCurrency(orderTotal)}</TotalValue>
          </TotalContainer>
        </OrderCard>
      </>
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text>Carregando comandas fechadas...</Text>
      </LoadingContainer>
    );
  }

  return (
    <Container>


      {error && (
        <View style={{ marginBottom: 16 }}>
          <ErrorText>{error}</ErrorText>
        </View>
      )}

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e7d32']}
            tintColor="#2e7d32"
          />
        }
        ListEmptyComponent={
          <EmptyState>
            <Ionicons name="receipt-outline" size={48} color="#666" />
            <EmptyText>
              Nenhuma comanda fechada encontrada{'\n'}para esta mesa.
            </EmptyText>
          </EmptyState>
        }
        contentContainerStyle={
          orders.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
        }
      />

      {/* Modal de Confirmação de Impressão */}
      {showPrintModal && selectedOrder && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <PrintModal>
            <ModalTitle>Imprimir Comanda</ModalTitle>
            <ModalText>Deseja imprimir a comanda #{selectedOrder.id.slice(-6)}?</ModalText>
            <ModalText>Mesa: {selectedOrder.table.name}</ModalText>
            <ModalText>Total: {formatCurrency(calculateOrderTotal(selectedOrder))}</ModalText>
            
            <ModalButtons>
              <CancelButton 
                onPress={() => {
                  setShowPrintModal(false);
                  setSelectedOrder(null);
                }}
                disabled={printing}
              >
                <ButtonText>Cancelar</ButtonText>
              </CancelButton>
              
              <PrintButtonModal 
                onPress={confirmPrint}
                disabled={printing}
              >
                {printing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <ButtonText>Imprimir</ButtonText>
                )}
              </PrintButtonModal>
            </ModalButtons>
          </PrintModal>
        </View>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 16px;
`;

const Header = styled.View`
  margin-bottom: 10;
`;

// const Title = styled.Text`
//   font-size: 24px;
//   font-weight: bold;
//   color: #fff;
// `;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  margin-top: 4px;
`;

const OrderCard = styled.View`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const OrderInfoContainer = styled.View`
  flex: 1;
`;

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

const PrintButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: #041224;
  border-radius: 6px;
  margin-left: 12px;
`;

const OrderInfo = styled.View`
  margin-bottom: 8px;
`;

const OrderText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 2px;
`;

const ProductsList = styled.View`
  margin-top: 8px;
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
  flex: 1;
`;

const ProductQuantity = styled.Text`
  font-size: 14px;
  color: #666;
  margin-left: 8px;
`;

const ProductPrice = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 8px;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
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
  color: #666;
  text-align: center;
  margin-top: 16px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #d32f2f;
  text-align: center;
  margin-top: 8px;
`;

const PrintModal = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

const ModalText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
`;

const ModalButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const ModalButton = styled.TouchableOpacity`
  padding: 12px 20px;
  border-radius: 6px;
  flex: 1;
  margin-horizontal: 5px;
  align-items: center;
`;

const CancelButton = styled(ModalButton)`
  background-color: #6c757d;
`;

const PrintButtonModal = styled(ModalButton)`
  background-color: #041224;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 500;
`;
