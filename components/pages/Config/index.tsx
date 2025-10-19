import { Text } from "@/components/atoms/Text";
import Title from "@/components/atoms/Title";
import { useRouter } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import * as S from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function ConfigPage() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <S.ScreenContainer>
      <S.Header>
        <Title>Configurações</Title>
      </S.Header>
      <S.ConfigScroll style={{ flex: 1 }}>
        <S.ItemRow onPress={() => router.push("/create-kitchen")}>
          <Ionicons
            name="restaurant-outline"
            size={22}
            color={theme.theme.colors.primary}
          />
          <S.ItemText>Gerenciar Cozinhas</S.ItemText>
        </S.ItemRow>

        <S.ItemRow onPress={() => router.push("/category")}>
          <Ionicons
            name="albums-outline"
            size={22}
            color={theme.theme.colors.primary}
          />
          <S.ItemText>Gerenciar Categorias e Produtos</S.ItemText>
        </S.ItemRow>

        <S.ItemRow onPress={() => router.push("/payment-config")}>
          <Ionicons
            name="card-outline"
            size={22}
            color={theme.theme.colors.primary}
          />
          <S.ItemText>Taxas</S.ItemText>
        </S.ItemRow>

        <S.ItemRow onPress={() => router.push("/create-user")}>
          <Ionicons
            name="people-outline"
            size={22}
            color={theme.theme.colors.primary}
          />
          <S.ItemText>Criar usuários</S.ItemText>
        </S.ItemRow>

        <S.ItemRow onPress={() => router.push("/users-list")}>
          <Ionicons
            name="list-outline"
            size={22}
            color={theme.theme.colors.primary}
          />
          <S.ItemText>Listar usuários</S.ItemText>
        </S.ItemRow>

        <S.ItemRow onPress={() => router.push("/completed-orders")}>
          <Ionicons
            name="print-outline"
            size={22}
            color={theme.theme.colors.primary}
          />
          <S.ItemText>Comandas finalizadas</S.ItemText>
        </S.ItemRow>

        <S.ItemRow onPress={() => router.push("/edit-account")}>
          <Ionicons
            name="person-outline"
            size={22}
            color={theme.theme.colors.primary}
          />
          <S.ItemText>Gerenciar conta</S.ItemText>
        </S.ItemRow>

        <S.Footer>
          <Text>Orbe v1.0</Text>
        </S.Footer>
      </S.ConfigScroll>
    </S.ScreenContainer>
  );
}
