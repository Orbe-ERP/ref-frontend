import { FlatList, Switch, Alert } from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { usePrinters } from "@/hooks/usePrinters";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";

export default function PrinterListScreen() {
  const theme = useAppTheme();

  const {
    printers,
    loading,
    createPrinter,
    updatePrinter,
  } = usePrinters();

  const [editingPrinter, setEditingPrinter] = useState<any | null>(null);

  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  function resetForm() {
    setEditingPrinter(null);
    setIp("");
    setPort("");
    setIsDefault(false);
  }

  function handleEdit(printer: any) {
    setEditingPrinter(printer);
    setIp(printer.ip);
    setPort(String(printer.port));
    setIsDefault(!!printer.default);
  }

  async function handleSave() {
    if (!ip || !port) {
      Alert.alert("Erro", "Preencha IP e porta");
      return;
    }

    const data = {
      ip,
      port: Number(port),
      default: isDefault,
    };

    if (editingPrinter) {
      await updatePrinter(editingPrinter.id, data);
    } else {
      await createPrinter({
        ...data,
        name: "Impressora",
        restaurantId: printers[0]?.restaurantId,
      });
    }

    resetForm();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Impressoras",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
          headerShadowVisible: false,
        }}
      />

      <S.Container>
        <S.FormCard>
          <S.FormTitle>
            {editingPrinter ? "Editar impressora" : "Nova impressora"}
          </S.FormTitle>

          <S.Field>
            <S.Label>IP da impressora</S.Label>
            <S.Input
              value={ip}
              onChangeText={setIp}
              placeholder="192.168.0.100"
            />
          </S.Field>

          <S.Field>
            <S.Label>Porta</S.Label>
            <S.Input
              value={port}
              onChangeText={setPort}
              keyboardType="numeric"
              placeholder="9100"
            />
          </S.Field>

          <S.SwitchRow>
            <S.Label>Impressora padrão</S.Label>
            <Switch value={isDefault} onValueChange={setIsDefault} />
          </S.SwitchRow>

          <S.Actions>
            <Button
              label="Cancelar"
              onPress={resetForm}
            />
            <Button
              label={editingPrinter ? "Salvar" : "Adicionar"}
              onPress={handleSave}
            />
          </S.Actions>
        </S.FormCard>

        <FlatList
          data={printers}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <S.Card>
              <S.InfoContainer>
                <S.Name>{item.name}</S.Name>
                <S.Info>
                  {item.ip}:{item.port}
                </S.Info>
              </S.InfoContainer>

              <Button
                label="Editar"
                onPress={() => handleEdit(item)}
              />
            </S.Card>
          )}
        />

        <S.ToastNotice>
            <S.ToastIcon>
                <Ionicons
                name="alert-circle-outline"
                size={20}
                color={theme.theme.colors.feedback.warning}
                />
            </S.ToastIcon>

            <S.ToastContent>
                <S.ToastTitle>Aviso importante</S.ToastTitle>
                <S.ToastText>
                    Para obter o IP da impressora, entre em contato com o suporte da impressora.
                </S.ToastText>
            </S.ToastContent>
        </S.ToastNotice>
      </S.Container>
    </>
  );
}
