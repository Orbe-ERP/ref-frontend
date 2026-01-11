import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import Title from "@/components/atoms/Title";
import Button from "@/components/atoms/Button";
import * as S from "./styles";

import {
  confirmPurchaseXml,
  calculatePurchaseTotal,
  matchStockItem,
} from "@/services/purchase";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { usePurchaseImport } from "@/context/PurchaseImportProvider";
import { Text } from "@/components/atoms/Text";

export default function ImportPreviewScreen() {
  const { theme } = useAppTheme();
  const { payload } = useLocalSearchParams<any>();

  const { items, setItems, reset } = usePurchaseImport();
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => {
    if (!payload) return null;
    return JSON.parse(payload);
  }, [payload]);

  useEffect(() => {
    if (!data?.items?.length) return;

    async function init() {
      const matched = await Promise.all(
        data.items.map(async (item: any) => {
          try {
            const match = await matchStockItem(data.restaurantId, item.name);

            if (!match?.stockItemId) {
              return { ...item, confidence: 0, needsAttention: true };
            }

            return {
              ...item,
              stockItemId: match.stockItemId,
              confidence: match.confidence,
              needsAttention: match.confidence < 0.8,
            };
          } catch {
            return { ...item, confidence: 0, needsAttention: true };
          }
        })
      );

      setItems(matched);
    }

    if (items.length === 0) {
      init();
    }
  }, [data?.items]);

  const total = useMemo(() => calculatePurchaseTotal(items), [items]);

  const hasAttentionItems = useMemo(
    () => items.some((i) => i.needsAttention),
    [items]
  );

  async function handleConfirm() {
    try {
      setSaving(true);

      const payloadToSend = items.map((i) => ({
        ...(i.stockItemId && { stockItemId: i.stockItemId }),
        name: i.name,
        unit: i.unit || "UNIT",
        quantity: i.quantity,
        unitCost: i.unitCost,
      }));

      await confirmPurchaseXml({
        restaurantId: data.restaurantId,
        invoiceKey: data.invoiceKey,
        supplierName: data.supplierName,
        items: payloadToSend,
      });

      Toast.show({
        type: "success",
        text1: "Compra importada com sucesso",
      });

      reset();
      router.replace("/stock/purchases");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err?.message || "Não foi possível importar a compra",
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
          <S.ContentCard style={{ marginBottom: 16 }}>
            <Title>Informações da Nota Fiscal</Title>

            <S.PreviewRow>
              <S.PreviewLabel>Fornecedor:</S.PreviewLabel>
              <S.PreviewValue>
                {data?.supplierName || data?.supplier?.name || "-"}
              </S.PreviewValue>
            </S.PreviewRow>

            <S.PreviewRow>
              <S.PreviewLabel>Nota Fiscal:</S.PreviewLabel>
              <S.PreviewValue>{data?.invoiceKey || "-"}</S.PreviewValue>
            </S.PreviewRow>

            <S.PreviewRow>
              <S.PreviewLabel>Data de Emissão:</S.PreviewLabel>
              <S.PreviewValue>
                {data?.date || data?.issuedAt
                  ? new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(data.date || data.issuedAt))
                  : "-"}
              </S.PreviewValue>
            </S.PreviewRow>

            {data?.note && (
              <S.PreviewRow>
                <S.PreviewLabel>Observação:</S.PreviewLabel>
                <S.PreviewValue>{data.note}</S.PreviewValue>
              </S.PreviewRow>
            )}
          </S.ContentCard>

          <S.ContentCard>
            <Title>Itens</Title>

            {items.map((item, index) => (
              <S.ItemCard
                key={index}
                style={{
                  borderColor: item.needsAttention
                    ? theme.colors.feedback.warning
                    : theme.colors.border,
                }}
              >
                <S.ItemTitle>{item.name}</S.ItemTitle>

                {item.needsAttention && (
                  <S.WarningText>
                    ⚠️ Verificação necessária (
                    {(item.confidence * 100).toFixed(0)}%)
                  </S.WarningText>
                )}

                {item.stockItemId && <Text>✅ Associado ao estoque</Text>}

                <S.ButtonRow>
                  <Button
                    label="Editar"
                    onPress={() =>
                      router.push({
                        pathname:
                          "/(private)/stock/purchases/edit-purchase-item",
                        params: { itemIndex: index },
                      })
                    }
                  />
                  <Button
                    label="Associar"
                    variant="secondary"
                    onPress={() =>
                      router.push({
                        pathname: "/(private)/stock/purchases/match-stock-item",
                        params: {
                          itemIndex: index,
                          itemName: item.name,
                          restaurantId: data.restaurantId,
                        },
                      })
                    }
                  />
                </S.ButtonRow>
              </S.ItemCard>
            ))}

            <S.TotalSection>
              <S.TotalLabelLarge>Total</S.TotalLabelLarge>
              <S.TotalLarge>R$ {total.toFixed(2)}</S.TotalLarge>
            </S.TotalSection>

            <Button
              label="Confirmar importação"
              disabled={saving}
              onPress={handleConfirm}
            />

            <Button
              label="Cancelar"
              variant="secondary"
              onPress={() => {
                reset();
                router.replace("/stock/purchases");
              }}
            />
          </S.ContentCard>
        </S.ScreenContainer>
      </ScrollView>
    </>
  );
}
