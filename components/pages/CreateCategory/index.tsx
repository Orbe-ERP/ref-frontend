import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import useRestaurant from "@/hooks/useRestaurant";
import { Stack, useRouter } from "expo-router";
import ExpertModal from "@/components/organisms/ExpertModal";
import {
  Category,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/category";
import ExpertCard from "@/components/molecules/ExpertCard";
import AddExpertCard from "@/components/molecules/AddTableCard";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { ScreenContainer } from "./styles";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const { theme } = useAppTheme();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { selectedRestaurant } = useRestaurant();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedRestaurant) {
        const data = await getCategories(selectedRestaurant.id);
        setCategories(data);
      }
    };
    fetchCategories();
  }, [selectedRestaurant]);

  const handleCreateCategory = async () => {
    const newCategory = await createCategory({
      name: newCategoryName,
      restaurantId: selectedRestaurant?.id,
      active: true,
    });
    setCategories((prev: any) => [...prev, newCategory]);
    setNewCategoryName("");
    setIsCreateVisible(false);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    const updated = await updateCategory({
      categoryId: selectedCategory.id,
      name: newCategoryName,
      restaurantId: selectedRestaurant?.id,
    });
    setCategories((prev: any) =>
      prev.map((t: any) => (t.id === updated.id ? updated : t))
    );
    setNewCategoryName("");
    setSelectedCategory(null);
    setIsEditVisible(false);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setCategories((prev) => prev.filter((t) => t.id !== selectedCategory.id));
    await deleteCategory(selectedCategory.id, selectedRestaurant?.id || null);
    setSelectedCategory(null);
    setIsEditVisible(false);
  };

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: "Categorias",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "15px"
        }}
      >
        {categories.map((category) => (
          <ExpertCard
            icon=""
            key={category.id}
            cardType={category}
            onPress={() =>
              router.push(`/create-product?categoryId=${category.id}`)
            }
            onEdit={() => {
              setSelectedCategory(category);
              setNewCategoryName(category.name);
              setIsEditVisible(true);
            }}
          />
        ))}

        <AddExpertCard
          onPress={() => setIsCreateVisible(true)}
          label="Criar Categoria"
        />
      </ScrollView>

      <ExpertModal
        visible={isCreateVisible}
        title="Nova Categoria"
        inputPlaceholder="Nome da Categoria"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        onClose={() => setIsCreateVisible(false)}
        onConfirm={handleCreateCategory}
        confirmLabel="Criar Categoria"
      />

      <ExpertModal
        visible={isEditVisible}
        title="Editar Categoria"
        inputPlaceholder="Nome da Categoria"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        onClose={() => setIsEditVisible(false)}
        onConfirm={handleUpdateCategory}
        confirmLabel="Atualizar"
        showDelete
        onDelete={handleDeleteCategory}
      />
    </ScreenContainer>
  );
}
