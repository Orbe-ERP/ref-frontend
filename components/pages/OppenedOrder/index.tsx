import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, Dimensions, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Checkbox } from "react-native-paper";
import { getOrders, Order, concludeOrders } from "@/services/order";
import useRestaurant from "@/hooks/useRestaurant";
import Toast from "react-native-toast-message";
import {
  getPaymentConfigs,
  PaymentConfig,
  CardBrandLabels,
} from "@/services/payment";
import * as S from "./styles";
import { TopBar } from "@/components/atoms/TopBar";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useAuth from "@/hooks/useAuth";

export default function OppenedOrderPage() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additional, setAdditional] = useState<number>(10);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const [searchText, setSearchText] = useState("");
  const screenWidth = Dimensions.get("window").width;
  const theme = useAppTheme();

  const fetchOrders = async () => {
    try {
      const data = await getOrders(tableId as string);

      const activeOrders = data.filter(
        (order: any) =>
          Array.isArray(order.products) &&
          order.products.some(
            (p: any) => p.status !== "CANCELED" && !p.deletedAt
          )
      );
      setOrders(activeOrders);
      setFilteredOrders(activeOrders);
    } catch {
      setError("Erro ao carregar os pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tableId) fetchOrders();
  }, [tableId]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.responsible.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchText, orders]);

  useEffect(() => {
    async function loadConfigs() {
      if (selectedRestaurant?.id) {
        const configs = await getPaymentConfigs(selectedRestaurant.id);
        setPaymentConfigs(configs);
      }
    }
    loadConfigs();
  }, [selectedRestaurant?.id]);

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAllVisible = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      const allVisibleIds = filteredOrders.map((order) => order.id);
      setSelectedOrders(allVisibleIds);
    }
  };

  const handlePaymentMethodSelect = (orderId: string, method: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentMethod: method,
              cardBrand: method.includes("CARD") ? o.cardBrand : undefined,
            }
          : o
      )
    );
  };

  const handleCardBrandSelect = (orderId: string, brand: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? { ...o, cardBrand: o.cardBrand === brand ? undefined : brand }
          : o
      )
    );
  };

  const handleConcludeSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      Toast.show({
        type: "info",
        text1: "Aviso",
        text2: "Selecione pelo menos uma comanda para concluir.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    try {
      for (const orderId of selectedOrders) {
        const o = orders.find((ord) => ord.id === orderId);
        if (!o?.paymentMethod) {
          Toast.show({
            type: "error",
            text1: "Selecione o método de pagamento",
            text2:
              "Selecione o método de pagamento em todas as comandas selecionadas.",
          });
          return;
        }
      }

      const firstOrder = orders.find((o) => o.id === selectedOrders[0])!;
      const isCard = firstOrder.paymentMethod.includes("CARD");
      const paymentConfigId = isCard
        ? paymentConfigs.find(
            (c) =>
              c.method === firstOrder.paymentMethod &&
              c.brand === firstOrder.cardBrand
          )?.id ?? null
        : null;

      const payload = {
        ordersArray: selectedOrders,
        restaurantId: selectedRestaurant?.id!,
        sumIndividually: false,
        tableId,
        additional,
        paymentMethod: firstOrder.paymentMethod,
        paymentConfigId,
        operator: user?.name || null,
      };

      const response = await concludeOrders(payload);

      if (response.status === "NO_ACTIVE_PRODUCTS") {
        Toast.show({
          type: "info",
          text1: "Comanda sem produtos ativos",
          text2: response.message,
          position: "top",
          visibilityTime: 4000,
        });
        return;
      }

      setSelectedOrders([]);
      setIsModalVisible(false);
      await fetchOrders();

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Comandas concluídas com sucesso!",
      });

      router.push({
        pathname: "/(private)/print-order",
        params: { identifier: response.orderIdentifier },
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro ao concluir comandas",
        text2: "Não foi possível concluir as comandas selecionadas.",
      });
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "WAITING_DELIVERY":
        return "Esperando Entrega";
      case "WORK_IN_PROGRESS":
        return "Preparando Pedido";
      case "PENDING":
        return "Pendente";
      case "COMPLETED":
        return "Concluído";
      case "CANCELED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const handleAdditional = (value: number) => {
    if (isNaN(value) || value <= 0) setAdditional(0);
    else if (value > 100) setAdditional(100);
    else setAdditional(value);
  };

  const groupedByResponsible = filteredOrders.reduce((acc, order) => {
    const key = order.responsible || "Sem responsável";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <S.Container>
      <Stack.Screen
        options={{
          title: "Comandas Abertas",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
        }}
      />

      <TopBar ordersCount={orders.length} />

      <S.SearchContainer>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <S.SearchInput
          placeholder="Filtrar por nome do responsável"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </S.SearchContainer>

      {filteredOrders.length > 0 && (
        <S.SelectAllContainer>
          <Checkbox
            status={
              selectedOrders.length === filteredOrders.length &&
              filteredOrders.length > 0
                ? "checked"
                : "unchecked"
            }
            onPress={toggleSelectAllVisible}
            color="#16a34a"
          />
          <S.SelectAllText>
            Selecionar todas ({filteredOrders.length} comandas)
          </S.SelectAllText>
        </S.SelectAllContainer>
      )}

      {loading && <S.LoadingText>Carregando pedidos...</S.LoadingText>}
      {error && <S.ErrorText>{error}</S.ErrorText>}
      {!loading && !error && orders.length === 0 && (
        <S.NoOrdersText>
          Nenhum pedido encontrado para essa mesa.
        </S.NoOrdersText>
      )}

      {!loading &&
        !error &&
        orders.length > 0 &&
        filteredOrders.length === 0 && (
          <S.NoOrdersText>
            Nenhuma comanda encontrada para &quot;{searchText}&quot;.
          </S.NoOrdersText>
        )}

      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedByResponsible).map(
          ([responsible, ordersByResponsible]) => {
            const allSelected = ordersByResponsible.every((o) =>
              selectedOrders.includes(o.id)
            );

            const toggleSelectAllFromResponsible = () => {
              const ids = ordersByResponsible.map((o) => o.id);

              setSelectedOrders((prev) =>
                allSelected
                  ? prev.filter((id) => !ids.includes(id))
                  : Array.from(new Set([...prev, ...ids]))
              );
            };

            return (
              <S.OrderItem key={responsible}>
                <S.Row>
                  <Checkbox
                    status={allSelected ? "checked" : "unchecked"}
                    onPress={toggleSelectAllFromResponsible}
                    color="#16a34a"
                  />
                  <S.OrderHeader>
                    <S.OrderText style={{ fontWeight: "bold", fontSize: 16 }}>
                      Responsável: {responsible}
                    </S.OrderText>
                    <S.OrderText>
                      {ordersByResponsible.length} comanda
                      {ordersByResponsible.length !== 1 && "s"}
                    </S.OrderText>
                  </S.OrderHeader>
                </S.Row>

                {ordersByResponsible.map((order) => {
                  const total = order.products.reduce(
                    (sum, item) =>
                      sum +
                      (item.appliedPrice && item.appliedPrice > 0
                        ? item.appliedPrice
                        : item.product?.price ?? 0) *
                        item.quantity,
                    0
                  );

                  const isSelected = selectedOrders.includes(order.id);

                  return (
                    <S.OrderItem
                      key={order.id}
                      style={{
                        marginTop: 10,
                        backgroundColor: theme.theme.colors.background,
                      }}
                    >
                      <S.Row>
                        <Checkbox
                          status={isSelected ? "checked" : "unchecked"}
                          onPress={() => toggleOrderSelection(order.id)}
                          color="#16a34a"
                        />
                        <S.OrderHeader>
                          <S.OrderText>Total: R$ {total.toFixed(2)}</S.OrderText>
                        </S.OrderHeader>
                      </S.Row>

                      {order.products.map((item) => {
                        const price =
                          item.appliedPrice && item.appliedPrice > 0
                            ? item.appliedPrice
                            : item.product?.price ?? 0;

                        return (
                          <S.ProductContainer key={item.productId}>
                            <S.ProductText>
                              Status: {getStatusLabel(item.status)}
                            </S.ProductText>
                            <S.ProductText>
                              Nome: {item.product?.name ?? "Produto não encontrado"}
                            </S.ProductText>
                            <S.ProductText>
                              Preço: R$ {price.toFixed(2)}
                            </S.ProductText>
                            <S.ProductText>
                              Cozinha:{" "}
                              {item.product?.kitchens?.length
                                ? item.product.kitchens
                                    .map((k: any) => k.name)
                                    .join(", ")
                                : "Não definida"}
                            </S.ProductText>
                            <S.ProductText>
                              Quantidade: {item.quantity}
                            </S.ProductText>
                          </S.ProductContainer>
                        );
                      })}

                      <S.PaymentMethodsContainer>
                        <S.PaymentMethodsText>
                          Método de pagamento:
                        </S.PaymentMethodsText>
                        <S.PaymentOptions style={{ width: screenWidth * 0.9 }}>
                          {["PIX", "CASH", "CREDIT_CARD", "DEBIT_CARD"].map(
                            (method) => {
                              const selected = order.paymentMethod === method;
                              return (
                                <S.PaymentButton
                                  key={method}
                                  selected={selected}
                                  onPress={() =>
                                    handlePaymentMethodSelect(order.id, method)
                                  }
                                >
                                  <Ionicons
                                    name={
                                      method === "PIX"
                                        ? "cash-outline"
                                        : method === "CASH"
                                        ? "wallet-outline"
                                        : "card-outline"
                                    }
                                    size={18}
                                    color={selected ? "#fff" : "#aaa"}
                                  />
                                  <S.PaymentButtonText selected={selected}>
                                    {method === "PIX"
                                      ? "PIX"
                                      : method === "CASH"
                                      ? "Dinheiro"
                                      : method === "CREDIT_CARD"
                                      ? "Crédito"
                                      : "Débito"}
                                  </S.PaymentButtonText>
                                </S.PaymentButton>
                              );
                            }
                          )}
                        </S.PaymentOptions>

                        {(order.paymentMethod === "CREDIT_CARD" ||
                          order.paymentMethod === "DEBIT_CARD") && (
                          <S.TaxList>
                            {paymentConfigs
                              .filter((c) => c.method === order.paymentMethod)
                              .map((config) => {
                                const selectedBrand =
                                  order.cardBrand === config.brand;
                                return (
                                  <S.TaxItem
                                    key={config.id}
                                    selected={selectedBrand}
                                    onPress={() =>
                                      handleCardBrandSelect(
                                        order.id,
                                        config.brand!
                                      )
                                    }
                                  >
                                    <S.TaxText selected={selectedBrand}>
                                      {CardBrandLabels[config.brand ?? "OUTRO"]}
                                    </S.TaxText>
                                  </S.TaxItem>
                                );
                              })}
                          </S.TaxList>
                        )}
                      </S.PaymentMethodsContainer>

                      <S.OrderText style={{ marginTop: 10 }}>
                        Adicional (%)
                      </S.OrderText>
                      <TextInput
                        keyboardType="numeric"
                        value={String(additional)}
                        onChangeText={(text) => handleAdditional(Number(text))}
                        placeholder="Ex: 10"
                        placeholderTextColor="#ddd"
                        style={{
                          backgroundColor: theme.theme.colors.overlay,
                          padding: 10,
                          borderRadius: 5,
                          fontSize: 16,
                          marginBottom: 10,
                        }}
                      />
                    </S.OrderItem>
                  );
                })}
              </S.OrderItem>
            );
          }
        )}
      </ScrollView>

      {orders.length > 0 && (
        <S.ConcludeButton onPress={() => setIsModalVisible(true)}>
          <S.ConcludeButtonText>
            Concluir ({selectedOrders.length}) Comanda
            {selectedOrders.length !== 1 && "s"}
          </S.ConcludeButtonText>
        </S.ConcludeButton>
      )}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <S.ModalOverlay>
          <S.ModalContent>
            <S.ModalTitle>
              Deseja fechar as {selectedOrders.length} comandas selecionadas?
            </S.ModalTitle>
            <S.ModalButtonsContainer>
              <S.ModalButton
                variant="cancel"
                onPress={() => setIsModalVisible(false)}
              >
                <S.ModalButtonText>Cancelar</S.ModalButtonText>
              </S.ModalButton>
              <S.ModalButton
                variant="confirm"
                onPress={handleConcludeSelectedOrders}
              >
                <S.ModalButtonText>Fechar Comandas</S.ModalButtonText>
              </S.ModalButton>
            </S.ModalButtonsContainer>
          </S.ModalContent>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}
