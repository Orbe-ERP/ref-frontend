import { Stack, useRouter } from "expo-router";
import React from "react";
import * as S from "./styles";

export default function OnboardPage() {
  const router = useRouter();

  return (
    <S.ScreenContainer>
        <Stack.Screen
            options={{
                title: "Ajuda",
                headerStyle: { backgroundColor: "#041224" },
                headerTintColor: "#fff",
            }}
        />
        <S.OnboardScroll style={{ flex: 1 }}>
            <S.ItemRow onPress={() => router.push("/(private)/Onboard/inicial-onboarding")}>
                <S.ItemText>Tela inicial</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/selectedrestaurant-onboarding")}>
                <S.ItemText>Selecionar/criar restaurante</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/createkitchen-onboarding")}>
                <S.ItemText>Criar cozinhas</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/categoryproducts-onboarding")}>
                <S.ItemText>Categorias, produtos e observações</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/tax-onboarding")}>
                <S.ItemText>Taxas de cartões</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/users-onboarding")}>
                <S.ItemText>Usuários</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/tables-onboarding")}>
                <S.ItemText>Mesas</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/dailyflow-onboarding")}>
                <S.ItemText>Fluxo do dia-a-dia</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/kitchen-onboarding")}>
                <S.ItemText>Tela da cozinha</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/report-onboarding")}>
                <S.ItemText>Relatórios</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/dashboard-onboarding")}>
                <S.ItemText>Dashboard</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/account-onboarding")}>
                <S.ItemText>Conta</S.ItemText>
            </S.ItemRow>

            <S.ItemRow onPress={() => router.push("/(private)/Onboard/completedorders-onboarding")}>
                <S.ItemText>Comandas finalizadas</S.ItemText>
            </S.ItemRow>
        </S.OnboardScroll>
    </S.ScreenContainer>
  );
}
