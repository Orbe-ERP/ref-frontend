import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Product } from "@/services/product";
import useRestaurant from "@/hooks/useRestaurant";
import Title from "@/components/atoms/Title";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import AddExpertCard from "@/components/molecules/AddTableCard";
import ExpertCard from "@/components/molecules/ExpertCard";
import { getProductsByCategoryId } from "@/services/category";
import ProductModal from "@/components/organisms/ProductModal";

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { selectedRestaurant } = useRestaurant();
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();

  async function fetchProducts() {
    if (!selectedRestaurant) return;

    try {
      const data = await getProductsByCategoryId(categoryId);
      setProducts(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log("Nenhum produto encontrado para essa categoria");
        setProducts([]);
      } else {
        console.error("Erro ao buscar produtos:", error);
      }
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [selectedRestaurant, categoryId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#041224", padding: 24 }}>
      <Stack.Screen options={{ title: "Produtos" }} />
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {products.length === 0 ? (
          <Text
            style={{
              color: "white",
              marginTop: 20,
              marginBottom: 20,
              textAlign: "center",
              width: "100%",
            }}
          >
            Nenhum produto encontrado nesta categoria.
          </Text>
        ) : (
          products.map((product) => (
            <ExpertCard
              icon="cube-outline"
              key={product.id}
              cardType={product}
              onPress={() => router.push(`/observation?productId=${product.id}`)}
              onEdit={() => {
                setSelectedProduct(product);
                setIsModalVisible(true);
              }}
            />
          ))
        )}

        <AddExpertCard
          onPress={() => {
            setSelectedProduct(null);
            setIsModalVisible(true);
          }}
          label="Criar Produto"
        />
      </ScrollView>

      {selectedRestaurant && categoryId && (
        <ProductModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct || undefined}
          categoryId={categoryId as string}
          restaurantId={selectedRestaurant.id}
          onSaved={fetchProducts}
        />
      )}
    </View>
  );
}
