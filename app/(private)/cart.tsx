import React, { useEffect, useState } from "react";
import { ScrollView, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import styled from "styled-components/native";
import { Switch } from "react-native-paper";
import { createOrder } from "@/services/order";
import { getObservationsByProduct } from "@/services/product";
import Button from "@/components/atoms/Button";
import Toast from "react-native-toast-message";

export default function CartScreen() {
  const router = useRouter();
  const { tableId, addedProducts } = useLocalSearchParams<{
    tableId: string;
    addedProducts: string;
  }>();

  const initialProducts = addedProducts ? JSON.parse(addedProducts) : [];

  const [availableObservations, setAvailableObservations] = useState<
    Record<string, string[]>
  >({});
  const [products, setProducts] = useState(() =>
    initialProducts.map((p: any) => ({
      ...p,
      cartItemId: `${p.productId}-${Date.now()}-${Math.random()}`, // ID único
      observations: p.description ? [p.description] : [],
    }))
  );
  const [responsible, setResponsible] = useState("");
  const [toTake, setToTake] = useState(false);

  const toggleObservation = (cartItemId: string, obs: string) => {
    setProducts((prev: any) =>
      prev.map((p: any) => {
        if (p.cartItemId !== cartItemId) return p;
        const alreadySelected = p.observations?.includes(obs);
        return {
          ...p,
          observations: alreadySelected
            ? p.observations.filter((o: string) => o !== obs)
            : [...(p.observations || []), obs],
        };
      })
    );
  };

  useEffect(() => {
    (async () => {
      const map: Record<string, string[]> = {};
      for (const product of initialProducts) {
        try {
          const obsList = await getObservationsByProduct(product.productId);
          map[product.productId] = obsList.map((item: any) => item.description);
        } catch (err) {
          Toast.show({
            type: "error",
            text1: "Erro ao carregar observações",
            text2: `Não foi possível carregar as observações para ${product.productName}.`,
          });
          map[product.productId] = [];
        }
      }
      setAvailableObservations(map);
    })();
  }, []);

  const handleQuantityChange = (cartItemId: string, delta: number) => {
    setProducts((prev: any) =>
      prev.map((p: any) =>
        p.cartItemId === cartItemId
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );
  };

  const handleRemoveProduct = (cartItemId: string) => {
    const filtered = products.filter((p: any) => p.cartItemId !== cartItemId);
    setProducts(filtered);
    router.replace({
      pathname: "/cart",
      params: {
        tableId,
        addedProducts: JSON.stringify(filtered),
      },
    });
  };

  const handleOrderSubmit = async () => {
    if (products.length === 0) {
      Toast.show({
        type: "error",
        text1: "Comanda vazia",
        text2: "Adicione ao menos um produto.",
      });
      return;
    }

    const newOrder = {
      tableId,
      toTake,
      responsible: responsible || "Genérico",
      products: products.map((product: any) => ({
        productId: product.productId,
        quantity: product.quantity,
        observation: product.observations?.join(", ") || "",
      })),
    };

    try {
      await createOrder(newOrder);
      setProducts([]);
      router.replace({
        pathname: "/cart",
        params: { tableId, addedProducts: JSON.stringify([]) },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao enviar pedido",
        text2: "Tente novamente.",
      });
    }
  };

  const goToOppenedOrder = () => {
    router.push({ pathname: "/oppened-order", params: { tableId } });
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          headerTitle: "Comanda",
          headerRight: () => (
            <Ionicons
              name="restaurant-outline"
              size={24}
              color="white"
              style={{ marginRight: 15 }}
              onPress={goToOppenedOrder}
            />
          ),
        }}
      />

      {products.length === 0 ? (
        <EmptyText>O carrinho está vazio.</EmptyText>
      ) : (
        <>
          <ScrollView>
            {products.map((product: any) => (
              <Card key={product.cartItemId}>
                <Label>{product.productName}</Label>
                <Label>Quantidade: {product.quantity}</Label>

                <Row>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(product.cartItemId, -1)}
                  >
                    <Ionicons name="remove-outline" size={24} color="#fff" />
                  </TouchableOpacity>

                  <Label>{product.quantity}</Label>

                  <TouchableOpacity
                    onPress={() => handleQuantityChange(product.cartItemId, 1)}
                  >
                    <Ionicons name="add-outline" size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemoveProduct(product.cartItemId)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#E74C3C" />
                  </TouchableOpacity>
                </Row>

                {availableObservations[product.productId]?.length ? (
                  <CheckboxContainer>
                    {availableObservations[product.productId].map(
                      (obs, idx) => {
                        const isSelected = product.observations?.includes(obs);
                        return (
                          <CheckboxItem
                            key={idx}
                            selected={isSelected}
                            onPress={() =>
                              toggleObservation(product.cartItemId, obs)
                            }
                          >
                            <CheckboxText>
                              {isSelected ? "☑ " : "☐ "}
                              {obs}
                            </CheckboxText>
                          </CheckboxItem>
                        );
                      }
                    )}
                  </CheckboxContainer>
                ) : (
                  <Label>Nenhuma observação disponível</Label>
                )}
              </Card>
            ))}

            <Input
              placeholder="Responsável"
              placeholderTextColor="#ccc"
              value={responsible}
              onChangeText={setResponsible}
            />

            <Row>
              <Label>Para viagem?</Label>
              <Switch value={toTake} onValueChange={setToTake} />
            </Row>
          </ScrollView>

          <Button
            label="Enviar Para Cozinha"
            variant="secondary"
            onPress={handleOrderSubmit}
          />
        </>
      )}
    </Container>
  );
}

export const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 20px;
`;

export const Card = styled.View`
  background-color: #1e293b;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: #334155;
  color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 16px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const CheckboxContainer = styled.View`
  margin-bottom: 12px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CheckboxItem = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected }: { selected: any }) =>
    selected ? "#038082" : "#334155"};
  border-radius: 6px;
  padding-vertical: 6px;
  padding-horizontal: 10px;
`;

export const CheckboxText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

export const EmptyText = styled.Text`
  color: #94a3b8;
  font-size: 16px;
  text-align: center;
  margin-top: 50px;
`;
