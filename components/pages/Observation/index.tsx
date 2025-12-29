import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as S from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import Button from "@/components/atoms/Button";

import useRestaurant from "@/hooks/useRestaurant";

import {
  getObservationsByProduct,
  addObservation,
  deleteObservation,
} from "@/services/product";

import {
  getModifierCategories,
  createModifierCategory,
  ModifierCategory,
} from "@/services/modifierCategory";

const TABS = {
  OBSERVATIONS: "Observações",
  MODIFIERS: "Modificadores",
} as const;

type TabType = keyof typeof TABS;

export default function ProductDetailsTabs() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const { selectedRestaurant } = useRestaurant();
  const [activeTab, setActiveTab] = useState<TabType>("OBSERVATIONS");
  const [observations, setObservations] = useState<any[]>([]);
  const [newObservationText, setNewObservationText] = useState("");
  const [isCreatingObservation, setIsCreatingObservation] = useState(false);
  const [categories, setCategories] = useState<ModifierCategory[]>([]);
  const [refreshingCategories, setRefreshingCategories] = useState(false);
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const loadObservations = async () => {
    if (!productId) return;
    try {
      const data = await getObservationsByProduct(productId);
      setObservations(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar as observações",
      });
    }
  };

  const loadCategories = async () => {
    if (!selectedRestaurant?.id) return;
    try {
      setRefreshingCategories(true);
      const data = await getModifierCategories(selectedRestaurant.id);
      setCategories(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar as categorias",
      });
    } finally {
      setRefreshingCategories(false);
    }
  };

  useEffect(() => {
    loadObservations();
  }, [productId]);

  useEffect(() => {
    loadCategories();
  }, [selectedRestaurant]);

  const handleCreateObservation = async () => {
    if (!newObservationText.trim()) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Digite a observação",
      });
      return;
    }
    try {
      setIsCreatingObservation(true);
      await addObservation({ productId, description: newObservationText });
      setNewObservationText("");
      await loadObservations();
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Observação adicionada",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível criar a observação",
      });
    } finally {
      setIsCreatingObservation(false);
    }
  };

  const handleDeleteObservation = async (id: string) => {
    try {
      await deleteObservation(id);
      await loadObservations();
      Toast.show({
        type: "success",
        text1: "Observação excluída",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível excluir a observação",
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Informe o nome da categoria",
      });
      return;
    }
    if (!selectedRestaurant?.id) return;
    try {
      setIsCreatingCategory(true);
      await createModifierCategory({
        name: newCategoryName.trim(),
        restaurantId: selectedRestaurant.id,
      });
      setModalVisibleCategory(false);
      setNewCategoryName("");
      await loadCategories();
      Toast.show({
        type: "success",
        text1: "Categoria criada",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível criar a categoria",
      });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      //await deleteModifierCategory(id);
      await loadCategories();
      Toast.show({
        type: "success",
        text1: "Categoria excluída",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível excluir a categoria",
      });
    }
  };

  const renderObservationsTab = () => (
    <View style={{ flex: 1, marginTop: 16 }}>
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.text.secondary + "50",
            borderRadius: 8,
            padding: 12,
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.surface,
          }}
          placeholder="Digite a observação"
          placeholderTextColor={theme.colors.text.secondary + "80"}
          value={newObservationText}
          onChangeText={setNewObservationText}
          onSubmitEditing={handleCreateObservation}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={{
            marginLeft: 8,
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
          }}
          onPress={handleCreateObservation}
          disabled={isCreatingObservation}
        >
          <Ionicons name="add-circle" size={28} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={observations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <S.ObservationItem>
            <S.ObservationText>{item.description}</S.ObservationText>
            <TouchableOpacity onPress={() => handleDeleteObservation(item.id)}>
              <Ionicons
                name="trash"
                size={20}
                color={theme.colors.feedback.error || "#FF3B30"}
              />
            </TouchableOpacity>
          </S.ObservationItem>
        )}
        ListEmptyComponent={
          <S.ListEmptyText>Nenhuma observação adicionada.</S.ListEmptyText>
        }
      />
    </View>
  );

  const renderModifiersTab = () => (
    <View style={{ flex: 1, marginTop: 16 }}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        refreshing={refreshingCategories}
        onRefresh={loadCategories}
        renderItem={({ item }) => (
          <S.Card>
            <View style={{ flex: 1 }}>
              <S.ItemName>{item.name}</S.ItemName>
              {item.modifiers && (
                <S.ItemInfo>{item.modifiers.length} modificadores</S.ItemInfo>
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ padding: 8, marginLeft: 8 }}
                onPress={() =>
                  router.push({
                    pathname: "/stock/modifiers/create-modifier",
                    params: { categoryId: item.id },
                  })
                }
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 8, marginLeft: 8 }}
                onPress={() => handleDeleteCategory(item.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={theme.colors.feedback.error || "#FF3B30"}
                />
              </TouchableOpacity>
            </View>
          </S.Card>
        )}
        ListEmptyComponent={
          <S.EmptyContainer>
            <Ionicons
              name="layers-outline"
              size={48}
              color={theme.colors.text.secondary || "#999"}
            />
            <S.EmptyText>Nenhuma categoria criada</S.EmptyText>
          </S.EmptyContainer>
        }
      />

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: theme.colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          zIndex: 1000,
        }}
        onPress={() => setModalVisibleCategory(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {modalVisibleCategory && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <S.ModalTitle style={{ color: theme.colors.text.primary }}>
              Nova Categoria
            </S.ModalTitle>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.colors.text.secondary + "50",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.surface,
                marginVertical: 16,
              }}
              placeholder="Nome da categoria"
              placeholderTextColor={theme.colors.text.secondary + "80"}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
              onSubmitEditing={handleCreateCategory}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.text.secondary + "50",
                  marginRight: 8,
                }}
                onPress={() => setModalVisibleCategory(false)}
                disabled={isCreatingCategory}
              >
                <S.ButtonText style={{ color: theme.colors.text.secondary }}>
                  Cancelar
                </S.ButtonText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: theme.colors.primary,
                }}
                onPress={handleCreateCategory}
                disabled={isCreatingCategory}
              >
                <S.ButtonText style={{ color: "#FFFFFF" }}>
                  {isCreatingCategory ? "Criando..." : "Criar"}
                </S.ButtonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Detalhes do Produto",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <S.ScreenContainer>
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          {Object.entries(TABS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                backgroundColor:
                  activeTab === key ? theme.colors.primary : "transparent",
                marginHorizontal: 4,
                alignItems: "center",
              }}
              onPress={() => setActiveTab(key as TabType)}
            >
              <S.TabText
                active={activeTab === key}
                style={{
                  color:
                    activeTab === key
                      ? theme.colors.surface
                      : theme.colors.text.secondary,
                }}
              >
                {label}
              </S.TabText>
            </TouchableOpacity>
          ))}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {activeTab === "OBSERVATIONS"
              ? renderObservationsTab()
              : renderModifiersTab()}
          </ScrollView>
        </KeyboardAvoidingView>
      </S.ScreenContainer>
    </>
  );
}
