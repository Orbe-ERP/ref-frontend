import { Text } from "@/components/atoms/Text";
import Title from "@/components/atoms/Title";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: #041224;
`;

export const Header = styled.View`
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #038082;
`;

export const ItemRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 15px;
`;

export const ItemText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  margin-left: 12px;
`;

export const Footer = styled.View`
  align-items: center;
  margin-top: 40px;
`;

export default function ConfigScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#041224" }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    >
      <ScreenContainer>
        <Header>
          <Title style={{ color: "#fff" }}>Configurações</Title>
        </Header>

        <ItemRow onPress={() => router.push("/create-kitchen")}>
          <Ionicons name="restaurant-outline" size={22} color="#038082" />
          <ItemText>Gerenciar Cozinhas</ItemText>
        </ItemRow>

        <ItemRow onPress={() => router.push("/category")}>
          <Ionicons name="albums-outline" size={22} color="#038082" />
          <ItemText>Gerenciar Categorias e Produtos</ItemText>
        </ItemRow>

        <ItemRow onPress={() => router.push("/payment-config")}>
          <Ionicons name="card-outline" size={22} color="#038082" />
          <ItemText>Taxas</ItemText>
        </ItemRow>

        <ItemRow onPress={() => router.push("/create-user")}>
          <Ionicons name="people-outline" size={22} color="#038082" />
          <ItemText>Criar usuários</ItemText>
        </ItemRow>

        <ItemRow onPress={() => router.push("/users-list")}>
          <Ionicons name="list-outline" size={22} color="#038082" />
          <ItemText>Listar usuários</ItemText>
        </ItemRow>

        <ItemRow onPress={() => router.push("/edit-account")}>
          <Ionicons name="person-outline" size={22} color="#038082" />
          <ItemText>Gerenciar conta</ItemText>
        </ItemRow>

        <Footer>
          <Text style={{ color: "#038082" }}>Orbe v1.0</Text>
        </Footer>
      </ScreenContainer>
    </ScrollView>
  );
}
