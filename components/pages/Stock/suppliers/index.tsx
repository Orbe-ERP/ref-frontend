import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";
import { Pencil, Trash2 } from "lucide-react-native";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import { deleteSupplier, getSuppliers, Supplier } from "@/services/supplier";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function SuppliersScreen() {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSuppliers();
    }, [])
  );
  async function loadSuppliers() {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os fornecedores",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: string) {
    router.push(`/stock/suppliers/${id}`);
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);

      await deleteSupplier(id);

      Toast.show({
        type: "success",
        text1: "Fornecedor excluído",
      });

      await loadSuppliers();
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível excluir o fornecedor",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <S.EmptyContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </S.EmptyContainer>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Fornecedores",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <S.ScreenContainer>
        <Button
          label="Cadastrar fornecedor"
          onPress={() => router.push("/stock/suppliers/new")}
        />

        {suppliers.length === 0 ? (
          <S.EmptyContainer>
            <S.EmptyText>Nenhum fornecedor cadastrado ainda.</S.EmptyText>
          </S.EmptyContainer>
        ) : (
          <FlatList
            data={suppliers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ marginTop: 16 }}
            renderItem={({ item }) => (
              <S.Card>
                <S.CardHeader>
                  <S.Title>{item.name}</S.Title>

                  <S.Actions>
                    <S.IconButton onPress={() => handleEdit(item.id)}>
                      <Pencil size={18} color={theme.colors.primary} />
                    </S.IconButton>

                    <S.IconButton onPress={() => handleDelete(item.id)}>
                      <Trash2 size={18} color={theme.colors.feedback.error} />
                    </S.IconButton>
                  </S.Actions>
                </S.CardHeader>

                {item.taxId && <S.Subtitle>CNPJ/CPF: {item.taxId}</S.Subtitle>}
                {item.contact && (
                  <S.Subtitle>Contato: {item.contact}</S.Subtitle>
                )}
              </S.Card>
            )}
          />
        )}
      </S.ScreenContainer>
    </>
  );
}
