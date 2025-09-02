// app/(private)/cart.tsx
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import CartProductCard from "@/components/molecules/CartProductCard/CartProductCard";
import { createOrder } from "@/services/order";
import { getObservationsByProduct } from "@/services/product";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Switch } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 20px;
`;

const EmptyText = styled.Text`
  color: #94a3b8;
  font-size: 16px;
  text-align: center;
  margin-top: 50px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export default function CartScreen() {
  const router = useRouter();
  const { tableId, addedProducts } = useLocalSearchParams<{
    tableId: string;
    addedProducts: string; // vem como string no router
  }>();

  // ⚡ converter addedProducts que vem como string para objeto
  const initialProducts = addedProducts ? JSON.parse(addedProducts) : [];

  const [products, setProducts] = useState(() =>
    initialProducts.map((p: any) => ({
      ...p,
      observations: p.description ? [p.description] : [],
    }))
  );
  const [availableObservations, setAvailableObservations] = useState<Record<string, string[]>>({});
  const [responsible, setResponsible] = useState("");
  const [toTake, setToTake] = useState(false);

  useEffect(() => {
    (async () => {
      const map: Record<string, string[]> = {};
      for (const product of initialProducts) {
        try {
          const obsList = await getObservationsByProduct(product.productId);
          map[product.productId] = obsList.map((item: any) => item.description);
        } catch {
          map[product.productId] = [];
        }
      }
      setAvailableObservations(map);
    })();
  }, []);

  const handleOrderSubmit = async () => {
    if (products.length === 0) {
      Alert.alert("Comanda vazia", "Adicione ao menos um produto.");
      return;
    }

    const newOrder = {
      tableId,
      toTake,
      responsible: responsible || "Genérico",
      products: products.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
        observation: p.observation || "",
      })),
    };

    try {
      await createOrder(newOrder);
      Alert.alert("Sucesso", "Pedido enviado para a cozinha!");
      router.back();
    } catch {
      Alert.alert("Erro", "Ocorreu um erro ao enviar o pedido.");
    }
  };

  return (
    <>
        <Stack.Screen options={{title: "Carrinho", }} />
        <Container>
        <ScrollView>
            {products.length > 0 ? (
            products.map((product, index) => (
                <CartProductCard
                key={index}
                product={product}
                availableObservations={availableObservations[product.productId] || []}
                onChangeQuantity={(delta) =>
                    setProducts((prev) =>
                    prev.map((p) =>
                        p.productId === product.productId
                        ? { ...p, quantity: Math.max(1, p.quantity + delta) }
                        : p
                    )
                    )
                }
                onRemove={() =>
                    setProducts((prev) => prev.filter((p) => p.productId !== product.productId))
                }
                onToggleObservation={(obs) =>
                    setProducts((prev) =>
                    prev.map((p) =>
                        p.productId === product.productId
                        ? {
                            ...p,
                            observations: p.observations?.includes(obs)
                                ? p.observations.filter((o) => o !== obs)
                                : [...(p.observations || []), obs],
                            }
                        : p
                    )
                    )
                }
                />
            ))
            ) : (
            <EmptyText>O carrinho está vazio.</EmptyText>
            )}

            <Input
            placeholder="Responsável"
            value={responsible}
            onChangeText={setResponsible}
            />

            <Row>
            <Label>Para viagem?</Label>
            <Switch value={toTake} onValueChange={setToTake} />
            </Row>
        </ScrollView>

        {products.length > 0 && (
            <Button label="Enviar para Cozinha" onPress={handleOrderSubmit} />
        )}
        </Container>
    </>
  );
}
