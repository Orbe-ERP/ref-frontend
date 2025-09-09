import Button from "@/components/atoms/Button";
import { CategoryItem } from "@/components/molecules/CategoryItem";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getObservationsByProduct } from "@/services/product";


export default function OrderScreen() {
  const router = useRouter();

  const [selectedProducts, setSelectedProducts] = useState<{
    [categoryId: string]: { productId: string; quantity: number };
  }>({});

  const [cart, setCart] = useState<
    { id: string; name: string; quantity: number }[]
  >([]);

  const [productObservations, setProductObservations] = useState<{
    [productId: string]: { id: string; description: string }[];
  }>({});

  const categories = [
    {
      id: "c1",
      name: "Bebidas",
      products: [
        { id: "p1", name: "Coca-Cola" },
        { id: "p2", name: "Suco de Laranja" },
      ],
    },
    {
      id: "c2",
      name: "Lanches",
      products: [
        { id: "p3", name: "Hambúrguer" },
        { id: "p4", name: "Batata Frita" },
      ],
    },
  ];

  const handleSelectProduct = async (
    categoryId: string,
    productId: string,
    quantity: number
  ) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [categoryId]: { productId, quantity },
    }));

    // 🔹 Buscar observações pré-cadastradas no backend
    try {
      const obs = await getObservationsByProduct(productId);
      setProductObservations((prev) => ({
        ...prev,
        [productId]: obs,
      }));
    } catch (err) {
      console.log("Erro ao buscar observações", err);
    }
  };

  const handleQuantityChange = (
    categoryId: string,
    productId: string,
    delta: number
  ) => {
    setSelectedProducts((prev) => {
      const current = prev[categoryId];
      if (!current || current.productId !== productId) return prev;

      const newQuantity = Math.max(1, current.quantity + delta);
      return {
        ...prev,
        [categoryId]: { productId, quantity: newQuantity },
      };
    });
  };

  const handleAddProduct = (
    productId: string,
    productName: string,
    quantity: number
  ) => {
    setCart((prev) => [
      ...prev,
      { id: productId, name: productName, quantity },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Comanda",
          headerStyle: { backgroundColor: "#041224" },
          headerTintColor: "#fff",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="cart-outline" size={24} color="white" />
              {cart.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "red",
                    borderRadius: 10,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {cart.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={{ flex: 1, backgroundColor: "#0a192f", padding: 16 }}>
        {categories.map((category) => (
          <View key={category.id} style={{ marginBottom: 20 }}>
            <Text style={{ color: "white", fontSize: 18, marginBottom: 8 }}>
              {category.name}
            </Text>

            {category.products.map((product) => (
              <View
                key={product.id}
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <CategoryItem
                  categoryId={category.id}
                  product={product}
                  selectedProductId={selectedProducts[category.id]?.productId}
                  quantity={selectedProducts[category.id]?.quantity}
                  onSelectProduct={handleSelectProduct}
                  onQuantityChange={handleQuantityChange}
                  onAddProduct={handleAddProduct}
                />

                {/* 🔹 Exibir observações pré-cadastradas */}
                {productObservations[product.id]?.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text
                      style={{ color: "#94a3b8", fontSize: 14, marginBottom: 4 }}
                    >
                      Observações:
                    </Text>
                    {productObservations[product.id].map((obs) => (
                      <Text
                        key={obs.id}
                        style={{ color: "#f8fafc", fontSize: 13, marginLeft: 8 }}
                      >
                        • {obs.description}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        <Button
          label="Ver comandas"
          onPress={() => {
            router.push("/(private)/oppened-order");
          }}
        />
      </ScrollView>
    </>
  );
}
