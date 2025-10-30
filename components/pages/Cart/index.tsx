import Button from "@/components/atoms/Button";
import CustomSwitch from "@/components/atoms/CustomSwitch";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { createOrder, NewOrder } from "@/services/order";
import { getObservationsByProduct } from "@/services/product";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import * as S from "./styles";

export default function CartPage() {
  const router = useRouter();
  const theme = useAppTheme();
  const { tableId, addedProducts } = useLocalSearchParams<{
    tableId: string;
    addedProducts: string;
  }>();

  const initialProducts = addedProducts ? JSON.parse(addedProducts) : [];

  const [availableObservations, setAvailableObservations] = useState<
    Record<string, any[]>
  >({});
  const [products, setProducts] = useState(() =>
    initialProducts.map((p: any) => ({
      ...p,
      cartItemId: `${p.productId}-${Date.now()}-${Math.random()}`,
      observations: p.observations || [],
      appliedPrice: p.appliedPrice ?? null,
      customDescription: "",
    }))
  );

  const [responsible, setResponsible] = useState("");
  const [toTake, setToTake] = useState(false);

  const toggleObservation = (cartItemId: string, obsId: string) => {
    setProducts((prev: any) =>
      prev.map((p: any) => {
        if (p.cartItemId !== cartItemId) return p;
        const alreadySelected = p.observations?.includes(obsId);
        return {
          ...p,
          observations: alreadySelected
            ? p.observations.filter((o: string) => o !== obsId)
            : [...(p.observations || []), obsId],
        };
      })
    );
  };

  useEffect(() => {
    (async () => {
      const map: Record<string, any[]> = {};
      for (const product of initialProducts) {
        try {
          const obsList = await getObservationsByProduct(product.productId);
          map[product.productId] = obsList;
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

    const newOrder: NewOrder = {
      tableId,
      toTake,
      responsible: responsible || "Genérico",
      products: products.map((product: any) => ({
        productId: product.productId,
        quantity: product.quantity,
        appliedPrice: product.appliedPrice ?? null,
        observations: product.observations || [],
        customObservation: product.customDescription || "",
      })),
    };
    try {
      await createOrder(newOrder);
      setProducts([]);
      setResponsible("");
      setToTake(false);
      router.replace({
        pathname: "/(tabs)/table",
        params: {},
      });
      Toast.show({
        type: "success",
        text1: "Pedido enviado!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao enviar pedido",
        text2: "Tente novamente.",
      });
      console.error(error);
    }
  };

  const goToOppenedOrder = () => {
    router.push({ pathname: "/oppened-order", params: { tableId } });
  };

  return (
    <S.Container>
      <Stack.Screen
        options={{
          title: "Comanda",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
          headerRight: () => (
            <Ionicons
              name="restaurant-outline"
              size={24}
              color="white"
              onPress={goToOppenedOrder}
            />
          ),
        }}
      />

      {products.length === 0 ? (
        <S.EmptyText>O carrinho está vazio.</S.EmptyText>
      ) : (
        <>
          <ScrollView>
            {products.map((product: any) => (
              <S.Card key={product.cartItemId}>
                <S.Label>{product.productName}</S.Label>
                <S.Label>Quantidade: {product.quantity}</S.Label>

                <S.Input
                  placeholder="Preço Especial (R$)"
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={product.appliedPrice?.toString() ?? ""}
                  onChangeText={(text: any) => {
                    const value = parseFloat(text);
                    setProducts((prev: any) =>
                      prev.map((p: any) =>
                        p.cartItemId === product.cartItemId
                          ? {
                              ...p,
                              appliedPrice:
                                isNaN(value) || value < 0 ? null : value,
                            }
                          : p
                      )
                    );
                  }}
                />

                <S.Row>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(product.cartItemId, -1)}
                  >
                    <Ionicons name="remove-outline" size={24} color="#2BAE66" />
                  </TouchableOpacity>

                  <S.Label>{product.quantity}</S.Label>

                  <TouchableOpacity
                    onPress={() => handleQuantityChange(product.cartItemId, 1)}
                  >
                    <Ionicons name="add-outline" size={24} color="#2BAE66" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemoveProduct(product.cartItemId)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#E74C3C" />
                  </TouchableOpacity>
                </S.Row>

                {availableObservations[product.productId]?.length ? (
                  <S.CheckboxContainer>
                    {availableObservations[product.productId].map((obs) => {
                      const isSelected = product.observations?.includes(obs.id);
                      return (
                        <S.CheckboxItem
                          key={obs.id}
                          selected={isSelected}
                          onPress={() =>
                            toggleObservation(product.cartItemId, obs.id)
                          }
                        >
                          <S.CheckboxText>
                            {isSelected ? "☑ " : "☐ "}
                            {obs.description}
                          </S.CheckboxText>
                        </S.CheckboxItem>
                      );
                    })}
                  </S.CheckboxContainer>
                ) : (
                  <S.Label>Nenhuma observação disponível</S.Label>
                )}

                <S.Input
                  placeholder="Observação livre (max 20 chars)"
                  placeholderTextColor="#ccc"
                  value={product.customDescription}
                  maxLength={20}
                  onChangeText={(text) => {
                    setProducts((prev: any) =>
                      prev.map((p: any) =>
                        p.cartItemId === product.cartItemId
                          ? { ...p, customDescription: text }
                          : p
                      )
                    );
                  }}
                />
              </S.Card>
            ))}

            <S.Input
              placeholder="Responsável"
              placeholderTextColor="#ccc"
              value={responsible}
              onChangeText={setResponsible}
            />

            <S.Row>
              <S.Label>Viagem?</S.Label>
              <CustomSwitch value={toTake} onValueChange={setToTake} />
            </S.Row>
          </ScrollView>

          <Button
            label="Enviar Para Cozinha"
            variant="secondary"
            onPress={handleOrderSubmit}
          />
        </>
      )}
    </S.Container>
  );
}
