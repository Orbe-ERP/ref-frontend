import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import ProductGrid from "@/components/organisms/ProductGrid";
import useRestaurant from "@/hooks/useRestaurant";
import { Product, getAllByCategory } from "@/services/product";
import { Stack, useRouter } from "expo-router";

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const { selectedRestaurant } = useRestaurant();
  const route = useRoute();
  const { categoryId } = route.params as { categoryId: string };
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedRestaurant) {
        const productsData = await getAllByCategory(categoryId);
        setProducts(productsData);
      }
    };
    fetchProducts();
  }, [selectedRestaurant]);

  return (
    <>
      <Stack.Screen options={{title: "Criar produtos", }} />
      <Container>
        <ProductGrid
          products={products}
          onAdd={() => console.log("Novo produto")}
          onEdit={(p) => console.log("Editar", p)}
          onObservations={(p) => router.navigate("/observation", { productId: p.id })}
        />
      </Container>
    </>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;
