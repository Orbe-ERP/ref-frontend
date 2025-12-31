import { Text } from "@/components/atoms/Text";
import Title from "@/components/atoms/Title";
import { useRouter } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import * as S from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useAuth from "@/hooks/useAuth";
import { ActivityIndicator, View } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";

export default function ConfigPage() {
  const router = useRouter();
  const theme = useAppTheme();
  const { user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const { scale, isMobile } = useResponsive();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.theme.colors.primary} />
      </View>
    );
  }

  return (
    <S.ScreenContainer>
      <S.Header>
        <Title>Configurações</Title>
      </S.Header>
      
      <S.ConfigScroll
  style={{ flex: 1 }}
  showsVerticalScrollIndicator={false}
>
        <S.ContentWrapper isMobile={isMobile}>
          <S.ScaleWrapper scale={scale}>
            {isAdmin && (
              <>
                <S.ItemRow onPress={() => router.push("/select-restaurant")}> 
                  <Ionicons name="albums" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Gerenciar Restaurantes</S.ItemText> 
                </S.ItemRow> 

                <S.ItemRow onPress={() => router.push("/create-kitchen")}> 
                  <Ionicons name="restaurant-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Gerenciar Cozinhas</S.ItemText> 
                </S.ItemRow> 

                <S.ItemRow onPress={() => router.push("/category")}> 
                  <Ionicons name="albums-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Gerenciar Categorias e Produtos</S.ItemText> 
                </S.ItemRow> 
                
                <S.ItemRow onPress={() => router.push("/payment-config")}> 
                  <Ionicons name="card-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Taxas</S.ItemText> 
                </S.ItemRow> 
                
                <S.ItemRow onPress={() => router.push("/create-user")}> 
                  <Ionicons name="people-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Criar Usuários</S.ItemText> 
                </S.ItemRow> 
                
                <S.ItemRow onPress={() => router.push("/completed-orders")}> 
                  <Ionicons name="checkmark-circle-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Comandas Finalizadas</S.ItemText> 
                </S.ItemRow> 
                
                <S.ItemRow onPress={() => router.push("/(private)/stock")}> 
                  <Ionicons name="server-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Gerenciar estoque</S.ItemText> 
                </S.ItemRow> 
                
                <S.ItemRow onPress={() => router.push("/printer")}> 
                  <Ionicons name="print-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Configuração da Impressora</S.ItemText> 
                </S.ItemRow> 
                
                <S.ItemRow onPress={() => router.push("/edit-account")}> 
                  <Ionicons name="person-outline" size={22} color={theme.theme.colors.primary} /> 
                  <S.ItemText>Gerenciar Conta</S.ItemText> 
                </S.ItemRow> </> 
              )} 
              
              <S.ItemRow onPress={() => router.push("/help")}> 
                <Ionicons name="information-circle-sharp" size={22} color={theme.theme.colors.primary} /> 
                <S.ItemText>Ajuda</S.ItemText>
              </S.ItemRow>
          </S.ScaleWrapper>

          <S.Footer>
            <Text>Orbe v1.0</Text>
          </S.Footer>
        </S.ContentWrapper>
      </S.ConfigScroll>

    </S.ScreenContainer>
  );
}