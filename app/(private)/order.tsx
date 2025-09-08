import { CategoryItem } from "@/components/molecules/CategoryItem";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ícones bonitos do expo

// Mock de dados
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

export default function OrderScreen() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<{
    [categoryId: string]: { productId: string; quantity: number };
  }>({});
  const [cart, setCart] = useState<{ id: string; name: string; quantity: number }[]>([]);

  const handleSelectProduct = (categoryId: string, productId: string, quantity: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [categoryId]: { productId, quantity },
    }));
  };

  const handleQuantityChange = (categoryId: string, productId: string, delta: number) => {
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

  const handleAddProduct = (productId: string, productName: string, quantity: number) => {
    setCart((prev) => [...prev, { id: productId, name: productName, quantity }]);
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
                <View style={{
                  position: "absolute",
                  right: -6,
                  top: -3,
                  backgroundColor: "red",
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}>
                  <Text style={{ color: "white", fontSize: 12 }}>{cart.length}</Text>
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
              <CategoryItem
                key={product.id}
                categoryId={category.id}
                product={product}
                selectedProductId={selectedProducts[category.id]?.productId}
                quantity={selectedProducts[category.id]?.quantity}
                onSelectProduct={handleSelectProduct}
                onQuantityChange={handleQuantityChange}
                onAddProduct={handleAddProduct}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}
