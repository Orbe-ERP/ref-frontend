import React, { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getPaymentConfigs,
  createOrUpdatePaymentConfig,
  deletePaymentConfig,
  PaymentMethod,
  PaymentMethodLabels,
  PaymentConfig,
  CardBrand,
  CardBrandLabels,
} from "@/services/payment";
import useRestaurant from "@/hooks/useRestaurant";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as S from "./styles";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import Toast from "react-native-toast-message";

export default function PaymengConfigPage() {
  const { selectedRestaurant } = useRestaurant();
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [brand, setBrand] = useState<CardBrand | "">("");
  const [feePercent, setFeePercent] = useState("");
  const [configs, setConfigs] = useState<PaymentConfig[]>([]);
  const theme = useAppTheme();

  const loadConfigs = useCallback(async () => {
    try {
      if (!selectedRestaurant?.id) {
        return;
      }
      const data = await getPaymentConfigs(selectedRestaurant.id);
      setConfigs(data);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao carregar configurações de pagamento.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  }, [selectedRestaurant?.id]);

  async function handleAdd() {
    if (!method || !feePercent || !brand) {
      Toast.show({
        type: "info",
        text1: "Erro",
        text2: "Preencha todos os campos!",
        position: "top",
        visibilityTime: 3000,
      });

      return;
    }

    if (!selectedRestaurant?.id) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Nenhum restaurante selecionado!",
        position: "top",
        visibilityTime: 3000,
      });

      return;
    }

    const fee = parseFloat(feePercent);
    if (isNaN(fee) || fee < 0) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Taxa deve ser um número válido!",
        position: "top",
        visibilityTime: 3000,
      });

      return;
    }

    try {
      await createOrUpdatePaymentConfig(selectedRestaurant.id, {
        method: method as PaymentMethod,
        brand: brand as CardBrand,
        feePercent: fee,
      });

      setFeePercent("");
      setMethod("");
      setBrand("");

      await loadConfigs();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao adicionar taxa.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  }

  async function handleDelete(item: PaymentConfig) {
    try {
      if (!selectedRestaurant?.id) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Nenhum restaurante selecionado!",
          position: "top",
          visibilityTime: 3000,
        });

        return;
      }
      await deletePaymentConfig(selectedRestaurant.id, item.method, item.brand);
      await loadConfigs();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Erro ao deletar taxa.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  }

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs, selectedRestaurant?.id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Gestão de Taxas",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
        }}
      />
      <S.Container>
        <S.Label>Tipo de Cartão</S.Label>
        <S.PickerContainer>
          <S.StyledPicker
            selectedValue={method}
            onValueChange={(value: string) => setMethod(value as PaymentMethod)}
            dropdownIconColor={theme.theme.colors.primary}
            itemStyle={{ height: 48, fontSize: 14 }}
          >
            <Picker.Item
              label="Selecione o tipo"
              value=""
              color={theme.theme.colors.text.secondary}
              style={{ fontSize: 14 }}
            />
            {Object.entries(PaymentMethodLabels).map(([key, label]) => (
              <Picker.Item
                key={key}
                label={label}
                value={key}
                color={theme.theme.colors.primary}
                style={{ fontSize: 14 }}
              />
            ))}
          </S.StyledPicker>
        </S.PickerContainer>

        <S.Label>Bandeira do Cartão</S.Label>
        <S.PickerContainer>
          <S.StyledPicker
            selectedValue={brand}
            onValueChange={(value: string) => setBrand(value as CardBrand)}
            dropdownIconColor={theme.theme.colors.primary}
            itemStyle={{ height: 48, fontSize: 14 }}
          >
            <Picker.Item
              label="Selecione a bandeira"
              value=""
              color={theme.theme.colors.text.secondary}
              style={{ fontSize: 14 }}
            />
            {Object.entries(CardBrandLabels).map(([key, label]) => (
              <Picker.Item
                key={key}
                label={label}
                value={key}
                color={theme.theme.colors.primary}
                style={{ fontSize: 14 }}
              />
            ))}
          </S.StyledPicker>
        </S.PickerContainer>

        <S.Label>Taxa (%)</S.Label>
        <S.Input
          keyboardType="numeric"
          placeholder="Ex: 2.5"
          placeholderTextColor={theme.theme.colors.text.primary}
          value={feePercent}
          onChangeText={setFeePercent}
        />
        <S.Row>
          <S.ButtonWrapper>
            <Button
              label="Limpar"
              variant="danger"
              onPress={() => {
                setFeePercent("");
                setMethod("");
                setBrand("");
              }}
            />
          </S.ButtonWrapper>

          <S.ButtonWrapper>
            <Button label="Adicionar Taxa" onPress={handleAdd} />
          </S.ButtonWrapper>
        </S.Row>

        <S.Title style={{ marginTop: 30 }}>Taxas Cadastradas</S.Title>
        {configs.length === 0 ? (
          <S.Subtitle>Nenhuma taxa cadastrada ainda.</S.Subtitle>
        ) : (
          <FlatList
            data={configs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <S.TaxItem>
                <S.TaxText>
                  {item.method ? PaymentMethodLabels[item.method] : "Sem tipo"}{" "}
                  - {item.brand ? CardBrandLabels[item.brand] : "Sem bandeira"}{" "}
                  - {item.feePercent}%
                </S.TaxText>
                <S.DeleteButton onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </S.DeleteButton>
              </S.TaxItem>
            )}
          />
        )}
      </S.Container>
    </>
  );
}
