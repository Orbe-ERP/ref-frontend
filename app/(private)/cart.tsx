import React, { useEffect, useState } from "react";
import { ScrollView, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import styled from "styled-components/native";
import { Switch } from "react-native-paper";

import { createOrder } from "@/services/order";
import { getObservationsByProduct } from "@/services/product";

export default function CartScreen() {
  const router = useRouter();
  const { tableId, addedProducts } = useLocalSearchParams<{
    tableId: string;
    addedProducts: string;
  }>();

  // como params chegam em string, precisa parsear os produtos
  const initialProducts = addedProducts ? JSON.parse(addedProducts) : [];

  const [availableObservations, setAvailableObservations] = useState<Record<string, string[]>>({});
  const [products, setProducts] = useState(() =>
    initialProducts.map((p: any) => ({
      ...p,
      observations: p.description ? [p.description] : [],
    }))
  );
  const [responsible, setResponsible] = useState("");
  const [toTake, setToTake] = useState(false);

  const toggleObservation = (productId: string, obs: string) => {
    setProducts((prev) =>
      prev.map((p: any) => {
        if (p.productId !== productId) return p;
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
          console.error(`Erro ao carregar observações de ${product.productName}`, err);
          map[product.productId] = [];
        }
      }
      setAvailableObservations(map);
    })();
  }, []);

  const handleQuantityChange = (productId: string, observation: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p: any) =>
        p.productId === productId && p.observation === observation
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );
  };

const handleRemoveProduct = (productId: string, observation: string) => {
  setProducts((prev) => {
    const filtered = prev.filter(
      (p: any) =>
        !(p.productId === productId && (p.observation || "") === (observation || ""))
    );

    // Atualiza os params com os produtos restantes
    router.replace({
      pathname: "/cart",
      params: {
        tableId,
        addedProducts: JSON.stringify(filtered),
      },
    });

    return filtered;
  });
};

  const handleOrderSubmit = async () => {
    if (products.length === 0) {
      Alert.alert("Comanda vazia", "Adicione ao menos um produto.");
      return;
    }

    const newOrder = {
      tableId,
      toTake,
      responsible: responsible || "Genérico",
      products: products.map((product: any) => ({
        productId: product.productId,
        quantity: product.quantity,
        observation: product.observation.id || "",
      })),
    };

    try {
      const response = await createOrder(newOrder);
      console.log("Pedido enviado para a cozinha:", response);
      Alert.alert("Sucesso", "Pedido enviado para a cozinha!");
      router.back();
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      Alert.alert("Erro", "Ocorreu um erro ao enviar o pedido.");
    }
  };

  return (
    <Container>
      <ScrollView>
        {products.length > 0 ? (
          products.map((product: any, index: number) => (
            <Card key={index}>
              <Label>{product.productName}</Label>
              <Label>Quantidade: {product.quantity}</Label>

              <Row>
                <TouchableOpacity
                  onPress={() =>
                    handleQuantityChange(product.productId, product.observation, -1)
                  }
                >
                  <Ionicons name="remove-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <Label>{product.quantity}</Label>
                <TouchableOpacity
                  onPress={() =>
                    handleQuantityChange(product.productId, product.observation, 1)
                  }
                >
                  <Ionicons name="add-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleRemoveProduct(product.productId, product.observation)
                  }
                >
                  <Ionicons name="trash-outline" size={24} color="#E74C3C" />
                </TouchableOpacity>
              </Row>

              {availableObservations[product.productId]?.length ? (
                <CheckboxContainer>
                  {availableObservations[product.productId].map((obs, idx) => {
                    const isSelected = product.observations?.includes(obs);
                    return (
                      <CheckboxItem
                        key={idx}
                        selected={isSelected}
                        onPress={() => toggleObservation(product.productId, obs)}
                      >
                        <CheckboxText>
                          {isSelected ? "☑ " : "☐ "}
                          {obs}
                        </CheckboxText>
                      </CheckboxItem>
                    );
                  })}
                </CheckboxContainer>
              ) : (
                <Label>Nenhuma observação disponível</Label>
              )}
            </Card>
          ))
        ) : (
          <EmptyText>O carrinho está vazio.</EmptyText>
        )}

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

      {products.length > 0 && (
        <SendButton onPress={handleOrderSubmit}>
          <SendButtonText>Enviar para Cozinha</SendButtonText>
        </SendButton>
      )}
    </Container>
  );
}

/* ---------------- STYLED COMPONENTS ---------------- */

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
  background-color: ${({ selected }) => (selected ? "#2563EB" : "#334155")};
  border-radius: 6px;
  padding-vertical: 6px;
  padding-horizontal: 10px;
`;

export const CheckboxText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

export const SendButton = styled.TouchableOpacity`
  background-color: #2a4b7c;
  border: 2px solid #038082;
  padding: 16px;
  border-radius: 10px;
  align-items: center;
  margin-top: 12px;
`;

export const SendButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

export const EmptyText = styled.Text`
  color: #94a3b8;
  font-size: 16px;
  text-align: center;
  margin-top: 50px;
`;
