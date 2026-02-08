import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as S from "./styles";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import useRestaurant from "@/hooks/useRestaurant";
import {
  createStockItem,
  updateStockItem,
  getStockById,
  Unit,
} from "@/services/stock";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { useResponsive } from "@/hooks/useResponsive";

const UNIT_LABELS: Record<Unit, string> = {
  [Unit.UNIT]: "Unidade",
  [Unit.GRAM]: "Grama (g)",
  [Unit.KILOGRAM]: "Quilograma (kg)",
  [Unit.MILLILITER]: "Mililitro (ml)",
  [Unit.LITER]: "Litro (L)",
  [Unit.PACKAGE]: "Pacote",
  [Unit.OTHER]: "Outro",
};

const UNIT_DESCRIPTIONS = {
  [Unit.UNIT]: "Unidades individuais",
  [Unit.GRAM]: "Peso em gramas (ex: temperos, especiarias, queijos)",
  [Unit.KILOGRAM]: "Peso em quilogramas (ex: carnes, legumes, farinhas)",
  [Unit.MILLILITER]: "Volume em mililitros (ex: molhos, condimentos, bebidas)",
  [Unit.LITER]: "Volume em litros (ex: óleos, bebidas em garrafa)",
  [Unit.PACKAGE]: "Pacotes fechados (ex: macarrão, biscoitos)",
  [Unit.OTHER]: "Unidade personalizada ou específica",
};

export default function CreateStock() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [showUnitInfo, setShowUnitInfo] = useState(false);
  const [showCostInfo, setShowCostInfo] = useState(false);
  const [form, setForm] = useState({
    name: "",
    unit: Unit.UNIT,
    quantity: "0",
    minimum: "",
    lastCost: "",
  });
  const { isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    if (id) {
      loadStockItem();
    }
  }, [id]);

  const loadStockItem = async () => {
    try {
      const data = await getStockById(id as string);
      setForm({
        name: data.name,
        unit: data.unit || Unit.UNIT,
        quantity: data.quantity.toString(),
        minimum: data.minimum?.toString() || "",
        lastCost: data.lastCost?.toString() || "",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar o item",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedRestaurant?.id) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Restaurante não selecionado",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (!form.name.trim()) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Informe o nome do item",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const stockData = {
        restaurantId: selectedRestaurant.id,
        name: form.name,
        unit: form.unit,
        quantity: parseFloat(form.quantity) || 0,
        minimum: form.minimum ? parseFloat(form.minimum) : undefined,
        lastCost: form.lastCost ? parseFloat(form.lastCost) : undefined,
      };

      if (id) {
        const { restaurantId, ...updateData } = stockData;
        await updateStockItem(id as string, updateData);

        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Item atualizado com sucesso",
          position: "top",
          visibilityTime: 2000,
        });

        router.replace({
          pathname: "/stock",
          params: { refresh: Date.now() },
        });
      } else {
        await createStockItem(stockData);

        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Item criado com sucesso",
          position: "top",
          visibilityTime: 2000,
        });

        router.replace({
          pathname: "/stock/items",
          params: { refresh: Date.now() },
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message || "Não foi possível salvar o item",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: id ? "Editar Item" : "Novo Item de Estoque",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <S.ToastNotice isTablet={isTablet} isDesktop={isDesktop}>
            <S.ToastIcon>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.colors.feedback.warning}
              />
            </S.ToastIcon>

            <S.ToastContent>
              <S.ToastTitle>Atenção à unidade de medida!</S.ToastTitle>
              <S.ToastText>
                Certifique-se de usar a mesma unidade de medida no cadastro e na
                composição. Exemplo: cadastre em &quot;gramas&quot; (1000g) e
                use em &quot;gramas&quot; (150g).
              </S.ToastText>
            </S.ToastContent>
          </S.ToastNotice>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text.primary,
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
              Nome do Item *
            </Text>
            <Input
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Ex: Tomate, Queijo, Pão"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.text.primary,
                  fontWeight: "500",
                }}
              >
                Unidade de Medida
              </Text>
              <TouchableOpacity
                onPress={() => setShowUnitInfo(!showUnitInfo)}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={{ fontSize: 12, color: theme.colors.primary }}>
                  {showUnitInfo ? "Ocultar ajuda" : "Ver explicações"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Informativo sobre unidades */}
            {showUnitInfo && (
              <S.UnitInfoContainer>
                <S.UnitInfoIcon>
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color={theme.colors.feedback.info}
                  />
                </S.UnitInfoIcon>
                <S.UnitInfoContent>
                  <S.UnitInfoTitle>Entenda as unidades</S.UnitInfoTitle>
                  <S.UnitInfoText>
                    Escolha a unidade que melhor representa como você mede o
                    item:
                  </S.UnitInfoText>
                  <View style={{ marginTop: 8 }}>
                    {Object.entries(UNIT_DESCRIPTIONS).map(
                      ([unitKey, description]) => (
                        <View
                          key={unitKey}
                          style={{ flexDirection: "row", marginBottom: 4 }}
                        >
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 12,
                              minWidth: 100,
                              color: theme.colors.text.primary,
                            }}
                          >
                            {unitKey}:
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: theme.colors.text.secondary,
                              flex: 1,
                            }}
                          >
                            {description}
                          </Text>
                        </View>
                      ),
                    )}
                  </View>
                </S.UnitInfoContent>
              </S.UnitInfoContainer>
            )}

            <Picker
              selectedValue={form.unit}
              onValueChange={(value) => setForm({ ...form, unit: value })}
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              {Object.values(Unit).map((unit) => (
                <Picker.Item
                  key={unit}
                  label={UNIT_LABELS[unit]}
                  value={unit}
                  style={{ fontSize: 14 }}
                />
              ))}
            </Picker>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text.primary,
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
              Quantidade Inicial
            </Text>
            <Input
              value={form.quantity}
              onChangeText={(text) => setForm({ ...form, quantity: text })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.text.primary,
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
              Estoque Mínimo (opcional)
            </Text>
            <Input
              value={form.minimum}
              onChangeText={(text) => setForm({ ...form, minimum: text })}
              placeholder="Quantidade mínima para alerta"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Custo individual (opcional)
                </Text>

                <TouchableOpacity
                  onPress={() => setShowCostInfo(!showCostInfo)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={{ fontSize: 12, color: theme.colors.primary }}>
                    {showCostInfo ? "Ocultar ajuda" : "Ver explicação"}
                  </Text>
                </TouchableOpacity>
              </View>
              {showCostInfo && (
                <S.UnitInfoContainer>
                  <S.UnitInfoIcon>
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color={theme.colors.feedback.info}
                    />
                  </S.UnitInfoIcon>

                  <S.UnitInfoContent>
                    <S.UnitInfoTitle>Como informar o custo?</S.UnitInfoTitle>
                    <S.UnitInfoText>
                      O custo deve ser o valor de{" "}
                      <Text style={{ fontWeight: "600" }}>
                        uma única unidade
                      </Text>{" "}
                      do item, conforme a unidade de medida selecionada.
                    </S.UnitInfoText>

                    <View style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        Exemplo: se a unidade for{" "}
                        <Text style={{ fontWeight: "600" }}>pacote</Text> e você
                        cadastrar{" "}
                        <Text style={{ fontWeight: "600" }}>5 pacotes</Text>,
                        informe aqui o{" "}
                        <Text style={{ fontWeight: "600" }}>
                          preço de cada pacote
                        </Text>
                        , e não o valor total.
                      </Text>
                    </View>
                  </S.UnitInfoContent>
                </S.UnitInfoContainer>
              )}
            </Text>
            <Input
              value={form.lastCost}
              onChangeText={(text) => setForm({ ...form, lastCost: text })}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={{ opacity: form.name.trim() && !loading ? 1 : 0.6 }}>
            <Button
              label={id ? "Atualizar Item" : "Criar Item"}
              onPress={form.name.trim() && !loading ? handleSubmit : () => {}}
              disabled={loading || !form.name.trim()}
            />
          </View>
        </ScrollView>
      </S.ScreenContainer>
    </>
  );
}
