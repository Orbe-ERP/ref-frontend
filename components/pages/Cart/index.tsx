import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useAppTheme } from "@/context/ThemeProvider/theme";
import { useResponsive } from "@/hooks/useResponsive";
import Button from "@/components/atoms/Button";
import CustomSwitch from "@/components/atoms/CustomSwitch";

import { createOrder, NewOrder } from "@/services/order";
import { getModifiersProduct, Modifier } from "@/services/modifier";

import * as S from "./styles";

interface ProductWithModifiers {
  modifiersSelected: Record<string, { selected: boolean; customText: string }>;
}

export default function CartPage() {
  const router = useRouter();
  const theme = useAppTheme();
  const { tableId, addedProducts } = useLocalSearchParams<{
    tableId: string;
    addedProducts: string;
  }>();
  const { isTablet, isDesktop, isWeb } = useResponsive();
  const isWide = isTablet || isDesktop;

  const initialProducts = addedProducts ? JSON.parse(addedProducts) : [];

  const [products, setProducts] = useState<ProductWithModifiers[]>(() =>
    initialProducts.map((p: any) => ({
      ...p,
      cartItemId: `${p.productId}-${Date.now()}-${Math.random()}`,
      quantity: p.quantity || 1,
      customDescription: p.customDescription || "",
      modifiersSelected: {},
    }))
  );

  const [modifiersMap, setModifiersMap] = useState<Record<string, Modifier[]>>(
    {}
  );
  const [toTake, setToTake] = useState(false);
  const [responsible, setResponsible] = useState("");

  const [expandedModifierByProduct, setExpandedModifierByProduct] = useState<
    Record<string, string | null>
  >({});

  const animationRefs = useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    (async () => {
      const map: Record<string, Modifier[]> = {};
      for (const p of initialProducts) {
        try {
          const mods = await getModifiersProduct(p.productId);
          map[p.productId] = mods;
          mods.forEach((mod: any) => {
            animationRefs.current[mod.id] = new Animated.Value(0);
          });
        } catch {
          map[p.productId] = [];
        }
      }
      setModifiersMap(map);
    })();
  }, []);

  // Toggle selected
  const toggleModifier = (productId: string, modifierId: string) => {
    setProducts((prev: any) =>
      prev.map((p: any) => {
        if (p.productId !== productId) return p;
        const current = p.modifiersSelected[modifierId] || {
          selected: false,
          customText: "",
        };
        return {
          ...p,
          modifiersSelected: {
            ...p.modifiersSelected,
            [modifierId]: { ...current, selected: !current.selected },
          },
        };
      })
    );
  };

  const setModifierCustomText = (
    productId: string,
    modifierId: string,
    text: string
  ) => {
    setProducts((prev: any) =>
      prev.map((p: any) => {
        if (p.productId !== productId) return p;
        const current = p.modifiersSelected[modifierId] || {
          selected: false,
          customText: "",
        };
        return {
          ...p,
          modifiersSelected: {
            ...p.modifiersSelected,
            [modifierId]: { ...current, customText: text },
          },
        };
      })
    );
  };

  const handleQuantityChange = (cartItemId: string, delta: number) => {
    setProducts((prev) =>
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
      responsible: responsible || "Não informado",
      products: products.map((p: any) => ({
        productId: p.productId,
        quantity: p.quantity,
        customObservation: p.customDescription,
        modifiers: Object.entries(p.modifiersSelected)
          .filter(([_, mod]: any) => mod.selected)
          .map(([modifierId, mod]: any) => ({
            modifierId,
            customText: mod.customText || null,
          })),
      })),
    };
    try {
      await createOrder(newOrder);
      Toast.show({ type: "success", text1: "Pedido enviado!" });
      router.replace({ pathname: "/(tabs)/table", params: {} });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao enviar pedido",
        text2: "Tente novamente.",
      });
    }
  };

  return (
    <S.Container isWeb={isWeb} isTablet={isTablet} isDesktop={isDesktop}>
      <Stack.Screen
        options={{
          title: "Comanda",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
        }}
      />

      <S.ContentWrapper isTablet={isTablet} isDesktop={isDesktop}>
        {products.length === 0 ? (
          <S.EmptyText isWide={isWide}>O carrinho está vazio.</S.EmptyText>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: 140,
              alignItems: isWide ? "center" : "stretch",
            }}
          >
            {products.map((product: any) => {
              const productModifiers = modifiersMap[product.productId] || [];
              return (
                <S.Card key={product.cartItemId} isWide={isWide}>
                  <S.Label>{product.productName}</S.Label>
                  <S.Label>Quantidade: {product.quantity}</S.Label>

                  <S.Row>
                    <TouchableOpacity
                      onPress={() =>
                        handleQuantityChange(product.cartItemId, -1)
                      }
                    >
                      <Ionicons
                        name="remove-outline"
                        size={24}
                        color="#2BAE66"
                      />
                    </TouchableOpacity>
                    <S.Label>{product.quantity}</S.Label>
                    <TouchableOpacity
                      onPress={() =>
                        handleQuantityChange(product.cartItemId, 1)
                      }
                    >
                      <Ionicons name="add-outline" size={24} color="#2BAE66" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveProduct(product.cartItemId)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={24}
                        color="#E74C3C"
                      />
                    </TouchableOpacity>
                  </S.Row>

                  <S.Input
                    placeholder="Observação livre..."
                    placeholderTextColor="#ccc"
                    value={product.customDescription}
                    maxLength={50}
                    onChangeText={(text) =>
                      setProducts((prev) =>
                        prev.map((p: any) =>
                          p.cartItemId === product.cartItemId
                            ? { ...p, customDescription: text }
                            : p
                        )
                      )
                    }
                  />

                  {productModifiers.length > 0 && (
                    <View
                      style={{
                        marginTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: "#eee",
                      }}
                    >
                      {productModifiers.map((mod) => {
                        const modState = product.modifiersSelected[mod.id] || {
                          selected: false,
                          customText: "",
                        };

                        return (
                          <View
                            key={mod.id}
                            style={{
                              paddingVertical: 6,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                toggleModifier(product.productId, mod.id)
                              }
                              style={{
                                width: 24,
                                height: 24,
                                borderWidth: 2,
                                borderColor: theme.theme.colors.primary,

                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 8,
                              }}
                            >
                              {modState.selected && (
                                <Text
                                  style={{
                                    color: theme.theme.colors.primary,
                                    fontWeight: "bold",
                                  }}
                                >
                                  V
                                </Text>
                              )}
                            </TouchableOpacity>

                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: theme.theme.colors.text.primary,
                                  fontWeight: "bold"
                                }}
                              >
                                {mod.name}
                              </Text>

                              {modState.selected && mod.allowFreeText && (
                                <S.Input
                                  placeholder="Observação..."
                                  placeholderTextColor={
                                    theme.theme.colors.text.secondary
                                  }
                                  value={modState.customText}
                                  maxLength={50}
                                  onChangeText={(text) =>
                                    setModifierCustomText(
                                      product.productId,
                                      mod.id,
                                      text
                                    )
                                  }
                                  style={{ marginTop: 4, paddingLeft: 0 }}
                                />
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </S.Card>
              );
            })}

            <S.Input
              placeholder="Responsável"
              placeholderTextColor="#ccc"
              value={responsible}
              onChangeText={setResponsible}
              style={isWide ? { width: "100%" } : undefined}
            />

            <S.Row>
              <S.Label>Para Viagem?</S.Label>
              <CustomSwitch value={toTake} onValueChange={setToTake} />
            </S.Row>
          </ScrollView>
        )}

        <S.ButtonContainer isWide={isWide}>
          <Button
            label="Enviar Para Cozinha"
            variant="primary"
            onPress={handleOrderSubmit}
          />
        </S.ButtonContainer>
      </S.ContentWrapper>
    </S.Container>
  );
}
