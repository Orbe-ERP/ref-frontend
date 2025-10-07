import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getCategories } from "@/services/category";
import useRestaurant from "@/hooks/useRestaurant";
import CategoryList from "@/components/organisms/CategoryList";
import Button from "@/components/atoms/Button";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import styled from "styled-components/native";

export default function OrderScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [addedProducts, setAddedProducts] = useState<any[]>([]);

  const router = useRouter();
  const { tableId } = useLocalSearchParams();
  const { selectedRestaurant } = useRestaurant();

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedRestaurant) {
        const categoriesData = await getCategories(selectedRestaurant.id);
        setCategories(categoriesData);
      }
    };
    fetchCategories();
  }, [selectedRestaurant]);

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  const handleProductChange = (catId: string, prodId: string, q: number, name: string) => {
    setSelectedProducts((prev: any) => ({
      ...prev,
      [catId]: { productId: prodId, quantity: q, productName: name },
    }));
  };

  const handleQuantityChange = (catId: string, prodId: string, delta: number, name: string) => {
    const current = selectedProducts[catId]?.productId === prodId
      ? selectedProducts[catId].quantity
      : 0;
    const newQ = Math.max(1, current + delta);
    handleProductChange(catId, prodId, newQ, name);
  };

  const handleAddProduct = (id: string, name: string, q: number) => {
    setAddedProducts((prev) => [
      ...prev,
      { productId: id, productName: name, quantity: q },
    ]);
  };

  const goToCart = () => {
    router.push({
      pathname: "/cart",
      params: { tableId, addedProducts: JSON.stringify(addedProducts) },
    });
  };
  const goToClosedOrders = () => {
    router.push({
      pathname: "/(private)/completed-orders",
      params: { tableId},
    });
  };

  const handleTablePress = () => {
    router.push({
      pathname: "/oppened-order",
      params: { tableId },
    });
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          headerTitle: "Comanda",
          headerRight: () => (


<HeaderRightContainer>
        {/* Novo ícone */}
        <CartContainer onPress={goToClosedOrders}>
          <Ionicons name="time-outline" size={24} color="white" />
        </CartContainer>

        {/* Ícone do carrinho */}
        <CartContainer onPress={goToCart}>
          <Ionicons name="cart-outline" size={24} color="white" />
          {addedProducts.length > 0 && (
            <Badge>
              <BadgeText>{addedProducts.length}</BadgeText>
            </Badge>
          )}
        </CartContainer>
      </HeaderRightContainer>

          ),
        }}
      />

      <CategoryList
        categories={categories}
        expandedCategory={expandedCategory}
        toggleCategory={toggleCategory}
        selectedProducts={selectedProducts}
        handleProductChange={handleProductChange}
        handleQuantityChange={handleQuantityChange}
        handleAddProduct={handleAddProduct}
      />

      <Footer>
        <Button
          label="Ver Comandas"
          variant="primary"
          onPress={handleTablePress}
        />
      </Footer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 16px;
`;

const Footer = styled.View`
  padding: 20px;
`;

const CartContainer = styled.TouchableOpacity`
  margin-right: 15px;
`;


const HeaderRightContainer = styled.View`
flex-direction: row; 
align-items: center;
 gap: 10px; 
` 

const Badge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: red;
  border-radius: 10px;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
`;


const BadgeText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: bold;
`;
