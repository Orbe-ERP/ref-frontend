import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { Stack, router } from "expo-router";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";

import { getPurchasesByRestaurant, Purchase } from "@/services/purchase";

export default function PurchaseListScreen() {
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (!selectedRestaurant?.id) return;
    loadPurchases();
  }, [selectedRestaurant?.id]);

  async function loadPurchases(isRefresh = false) {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const data = await getPurchasesByRestaurant(selectedRestaurant!.id);

      setPurchases(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar as compras",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function renderItem({ item }: { item: Purchase }) {
    return (
      <S.Card>
        <S.Header>
          <S.Supplier>{item.supplier?.name}</S.Supplier>
          <S.Total>R$ {item.total.toFixed(2).replace(".", ",")}</S.Total>
        </S.Header>

        <S.Meta>
          <S.MetaText>
            Emissão: {dayjs(item.issuedAt).format("DD/MM/YYYY")}
          </S.MetaText>

          {item.invoiceKey && (
            <S.MetaText numberOfLines={1}>NF: {item.invoiceKey}</S.MetaText>
          )}
        </S.Meta>

        <S.ItemsContainer>
          <S.ItemsTitle>Itens</S.ItemsTitle>

          {item.items.map((it: any, index: any) => (
            <S.ItemRow key={it.id}>
              <S.ItemLeft>
                <S.ItemText>Item {index + 1}</S.ItemText>
                <S.ItemSub>
                  Qtd: {it.quantity} × R$ {it.unitCost.toFixed(2)}
                </S.ItemSub>
              </S.ItemLeft>

              <S.ItemTotal>R$ {it.totalCost.toFixed(2)}</S.ItemTotal>
            </S.ItemRow>
          ))}
        </S.ItemsContainer>

        <S.Footer>
          <S.FooterText>{item.items.length} item(ns)</S.FooterText>

          <S.FooterText>
            Criado em {dayjs(item.createdAt).format("DD/MM/YYYY")}
          </S.FooterText>
        </S.Footer>
      </S.Card>
    );
  }

  if (loading) {
    return (
      <S.LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <S.LoadingText>Carregando compras...</S.LoadingText>
      </S.LoadingContainer>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Compras",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        {purchases.length === 0 ? (
          <S.EmptyContainer>
            <S.EmptyText>Nenhuma compra encontrada</S.EmptyText>

            <Button
              label="Nova compra"
              onPress={() => router.push("/stock/purchases/manual")}
            />
          </S.EmptyContainer>
        ) : (
          <>
            <FlatList
              data={purchases}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              refreshing={refreshing}
              onRefresh={() => loadPurchases(true)}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            />

            <S.FloatingButton>
              <Button
                label="Nova compra"
                onPress={() => router.push("/stock/purchases/manual")}
              />
            </S.FloatingButton>
          </>
        )}
      </S.ScreenContainer>
    </>
  );
}
