import React from "react";
import { Platform } from "react-native";
import { Stack, router } from "expo-router";
import * as S from "./styles";
import Title from "@/components/atoms/Title";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function PurchaseIndexScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useAppTheme();  

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
        <S.Card>
          <Title>Compra manual</Title>
          <S.InfoText>
            Registre uma compra informando fornecedor e itens manualmente.
          </S.InfoText>

          <Button
            label="Criar compra manual"
            onPress={() => router.push("/stock/purchases/manual")}
          />
        </S.Card>

        <S.Card>
          <Title>Importar XML</Title>
          <S.InfoText>
            Importe uma nota fiscal em XML para preencher a compra
            automaticamente.
          </S.InfoText>

          {isWeb ? (
            <Button
              label="Importar XML"
              onPress={() => router.push("/stock/purchases/import-upload")}
            />
          ) : (
            <>
              <Button label="Importar XML" disabled onPress={() => {}} />
              <S.HelpText>
                Disponível apenas na versão web.
              </S.HelpText>
            </>
          )}
        </S.Card>
      </S.ScreenContainer>
    </>
  );
}
