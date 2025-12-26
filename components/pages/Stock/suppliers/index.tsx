import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { Stack, router } from "expo-router";
import Toast from "react-native-toast-message";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import { getSuppliers, Supplier } from "@/services/supplier";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function SuppliersScreen() {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    loadSuppliers();
  }, []);

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
        }}
      />

      <S.ScreenContainer>
        <Button
          label="Cadastrar fornecedor"
          onPress={() => router.push("/stock/suppliers/new")}
        />

        {suppliers.length === 0 ? (
          <S.EmptyContainer>
            <S.EmptyText>
              Nenhum fornecedor cadastrado ainda.
            </S.EmptyText>
          </S.EmptyContainer>
        ) : (
          <FlatList
            data={suppliers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ marginTop: 16 }}
            renderItem={({ item }) => (
              <S.Card>
                <S.Title>{item.name}</S.Title>
                {item.taxId && (
                  <S.Subtitle>Documento: {item.taxId}</S.Subtitle>
                )}
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
