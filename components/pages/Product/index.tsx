import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Product } from "@/services/product";
import useRestaurant from "@/hooks/useRestaurant";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import AddExpertCard from "@/components/molecules/AddTableCard";
import ExpertCard from "@/components/molecules/ExpertCard";
import { getProductsByCategoryId } from "@/services/category";
import ProductModal from "@/components/organisms/ProductModal";
import { getKitchens, Kitchen } from "@/services/kitchen";
import Toast from "react-native-toast-message";
import { ScreenContainer } from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { theme } = useAppTheme();
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
        Toast.show({
          type: "info",
          text1: "Nenhum produto encontrado para essa categoria",
        });
        setProducts([]);
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao carregar produtos",
          text2: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }
  }

  async function fetchKitchens() {
    if (!selectedRestaurant) return;
    try {
      const data = await getKitchens(selectedRestaurant.id);
      setKitchens(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setKitchens([]);
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao buscar cozinhas",
        });
      }
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchKitchens();
  }, [selectedRestaurant, categoryId]);

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: "Produtos",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {products.length === 0 ? (
          <Text
            style={{
              color: theme.colors.text.primary,
              textAlign: "center",
              width: "100%",
              marginTop: 20,
            }}
          >
            Nenhum produto encontrado nesta categoria.
          </Text>
        ) : (
          products.map((product) => (
            <View key={product.id} style={{ marginInline: 16 }}>
              <ExpertCard
                icon="cube-outline"
                cardType={product}
                onPress={() =>
                  router.push(`/observation?productId=${product.id}`)
                }
                onEdit={() => {
                  setSelectedProduct(product);
                  setIsModalVisible(true);
                }}
              />
            </View>
          ))
        )}

        <View style={{ marginBottom: 16 }}>
          <AddExpertCard
            onPress={() => {
              setSelectedProduct(null);
              setIsModalVisible(true);
            }}
            label="Criar Produto"
          />
        </View>
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
          kitchens={kitchens}
        />
      )}
    </ScreenContainer>
  );
}
