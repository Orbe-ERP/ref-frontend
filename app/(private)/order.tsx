import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { CategoryItem } from "@/components/molecules/CategoryItem"; // ajuste o path se mudar

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

      <View style={{ marginTop: 20, backgroundColor: "#1b263b", padding: 12, borderRadius: 8 }}>
        <Text style={{ color: "white", fontSize: 16, marginBottom: 6 }}>🛒 Carrinho:</Text>
        {cart.length === 0 ? (
          <Text style={{ color: "gray" }}>Nenhum item adicionado</Text>
        ) : (
          cart.map((item, index) => (
            <Text key={index} style={{ color: "white" }}>
              {item.quantity}x {item.name}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}
