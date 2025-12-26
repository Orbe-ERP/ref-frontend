import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import Title from "@/components/atoms/Title";
import Button from "@/components/atoms/Button";
import * as S from "./styles";

import {
  confirmPurchaseXml,
  calculatePurchaseTotal,
} from "@/services/purchase";
import { useAppTheme } from "@/context/ThemeProvider/theme";

interface PreviewItem {
  stockItemId: string;
  name: string;
  quantity: number;
  unitCost: number;
}

interface PreviewPayload {
  restaurantId: string;
  supplierName?: string;
  date?: string;
  items: PreviewItem[];
}

export default function ImportPreviewScreen() {
  const { theme } = useAppTheme();  
  const { payload } = useLocalSearchParams<{ payload: string }>();
  const [saving, setSaving] = useState(false);

  const data: PreviewPayload = useMemo(() => {
    if (!payload) return {} as PreviewPayload;
    return JSON.parse(payload);
  }, [payload]);

  const total = calculatePurchaseTotal(data.items || []);

  async function handleConfirm() {
    try {
      setSaving(true);

      await confirmPurchaseXml(data);

      Toast.show({
        type: "success",
        text1: "Compra importada com sucesso",
      });

      router.replace("/stock/purchases");
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível confirmar a importação",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Pré-visualização da Compra",
          headerStyle: { backgroundColor: theme.colors.background }, 
          headerTintColor: theme.colors.text.primary,
        }} 
      />

      <ScrollView>
        <S.ScreenContainer>
          {/* INFORMAÇÕES */}
          <S.Card>
            <Title>Fornecedor</Title>
            <S.InfoText>
              {data.supplierName || "Não informado"}
            </S.InfoText>

            <Title style={{ marginTop: 12 }}>Data</Title>
            <S.InfoText>{data.date || "—"}</S.InfoText>
          </S.Card>

          {/* ITENS */}
          <Title style={{ marginVertical: 16 }}>Itens</Title>

          {data.items?.map((item, index) => (
            <S.ItemCard key={index}>
              <S.ItemHeader>
                <S.ItemTitle>{item.name}</S.ItemTitle>
              </S.ItemHeader>

              <S.Row>
                <S.Label>Quantidade</S.Label>
                <S.InfoText>{item.quantity}</S.InfoText>
              </S.Row>

              <S.Row>
                <S.Label>Custo unitário</S.Label>
                <S.InfoText>
                  R$ {item.unitCost.toFixed(2)}
                </S.InfoText>
              </S.Row>

              <S.ItemTotal>
                <S.Label>Subtotal</S.Label>
                <S.ItemTotalValue>
                  R$ {(item.quantity * item.unitCost).toFixed(2)}
                </S.ItemTotalValue>
              </S.ItemTotal>
            </S.ItemCard>
          ))}

          <S.TotalSection>
            <S.TotalLabelLarge>Total</S.TotalLabelLarge>
            <S.TotalLarge>R$ {total.toFixed(2)}</S.TotalLarge>
          </S.TotalSection>

          <Button
            label="Confirmar importação"
            onPress={handleConfirm}
          />

          <Button
            label="Cancelar"
            variant="secondary"
            onPress={() => router.back()}
          />
        </S.ScreenContainer>
      </ScrollView>
    </>
  );
}
