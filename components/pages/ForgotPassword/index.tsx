import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { requestPasswordReset } from "@/services/auth";
import * as S from "./styles";

export default function ForgotPassword() {
  const { theme } = useAppTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Informe seu e-mail",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Digite um e-mail válido",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await requestPasswordReset(email);

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: response.message || "Se o e-mail existir, você receberá um link",
        position: "top",
        visibilityTime: 4000,
      });

      router.replace("/login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err?.response?.data?.message || "Erro ao solicitar redefinição",
        position: "top",
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <S.Header>
            <S.BackButton onPress={() => router.replace("/login")}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={theme.colors.text.primary}
              />
            </S.BackButton>
            <S.HeaderTitle>Esqueci minha senha</S.HeaderTitle>
            <View style={{ width: 40 }} />
          </S.Header>

          <S.FormContainer>
            <S.InputGroup>
              <S.Label>E-mail</S.Label>
              <S.InputWrapper>
                <S.IconWrapper>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={theme.colors.text.muted}
                  />
                </S.IconWrapper>
                <S.StyledInput
                  placeholder="seu@email.com"
                  placeholderTextColor={theme.colors.text.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </S.InputWrapper>
              <S.HintText>
                Enviaremos um link para você redefinir sua senha
              </S.HintText>
            </S.InputGroup>

            <S.SubmitButton onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <S.SubmitButtonText>Enviar link</S.SubmitButtonText>
              )}
            </S.SubmitButton>

            <S.LoginContainer>
              <S.LoginText>Lembrou da senha? </S.LoginText>
              <S.LoginButton onPress={() => router.push("/login")}>
                <S.LoginButtonText>Faça login</S.LoginButtonText>
              </S.LoginButton>
            </S.LoginContainer>
          </S.FormContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </S.Container>
  );
}
