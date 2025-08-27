import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useRestaurant from "@/hooks/useRestaurant";
import { Category, createCategory, deleteCategory, getCategories, updateCategory } from "@/services/category";
import CategoryGrid from "@/components/organisms/CategoryGrid";
import CategoryModal from "@/components/organisms/CategoryModal";
import Label from "@/components/atoms/Label";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #041224;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { selectedRestaurant } = useRestaurant();
  const router = useRouter()

  useEffect(() => {
    if (selectedRestaurant) {
      getCategories(selectedRestaurant.id).then(setCategories);
    }
  }, [selectedRestaurant]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newCategory = await createCategory({
      name: newCategoryName,
      restaurantId: selectedRestaurant?.id,
      active: true,
      products: null,
    });
    setCategories([...categories, newCategory]);
    setIsModalVisible(false);
    setNewCategoryName("");
  };

  const handleCategoryPress = (category: Category) => {
    router.navigate("/product", { categoryId: category.id, restaurantId: selectedRestaurant?.id });
  };

  return !selectedRestaurant ? (
    <Container>
      <Ionicons name="warning-outline" size={48} color="#FBBF24" />
      <Label>Por favor, selecione um restaurante antes de criar categorias.</Label>
    </Container>
  ) : (
    <Container>
      <CategoryGrid
        categories={categories}
        onPress={(id) => handleCategoryPress(categories.find((c) => c.id === id)!)}
        onEdit={() => {}}
        onAdd={() => setIsModalVisible(true)}
      />
      <CategoryModal
        visible={isModalVisible}
        title="Nova Categoria"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleCreateCategory}
        confirmText="Criar Categoria"
      />
    </Container>
  );
}
