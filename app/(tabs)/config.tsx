import { Text } from "@/components/atoms/Text";
import Title from "@/components/atoms/Title";
import { ConfigLink } from "@/components/molecules/ConfigLink";
import { ConfigCard } from "@/components/organisms/ConfigCard";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: #041224;
`;

export const Content = styled.View`
  flex: 1;
  padding: 15px;
`;

export const Footer = styled.View`
  align-items: center;
  margin-top: 20px;
`;

export default function ConfigScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#041224" }}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#041224",
      }}
    >
      <ScreenContainer>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#041224",
            paddingVertical: 20,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#038082",
          }}
        >
          <Title>Configurações</Title>
        </View>

        <Content>
          <ConfigCard icon="person" title="Gerenciar conta">
            <ConfigLink
              href={{
                pathname: "/edit-account",
                params: { field: "name" },
              }}
              label="Editar nome, alterar senha..."
            />
          </ConfigCard>

          <ConfigCard icon="book" title="Gerenciar Categorias e Produtos">
            <ConfigLink
              href={{ pathname: "/category" }}
              label="Criar categorias, criar produtos..."
            />
          </ConfigCard>

                    <ConfigCard icon="kitchen" title="Gerenciar Cozinhas">
            <ConfigLink
              href={{ pathname: "/create-kitchen" }}
              label="Criar cozinhas..."
            />
          </ConfigCard>

                    <ConfigCard icon="tax" title="Gerenciar conta">
            <ConfigLink
              href={{
                pathname: "/tax",
                params: { field: "name" },
              }}
              label="Taxas..."
            />
          </ConfigCard>


          <ConfigCard icon="people" title="Gerenciar usuários">
            <ConfigLink
              href={{ pathname: "/create-user" }}
              label="Criar usuários"
            />
            <ConfigLink
              href={{ pathname: "/users-list" }}
              label="Listar usuários"
            />
          </ConfigCard>

          <Footer>
            <Text>Orbe v1.0</Text>
          </Footer>
        </Content>
      </ScreenContainer>
    </ScrollView>
  );
}
