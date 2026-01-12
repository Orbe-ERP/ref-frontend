import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { resetPassword } from "@/services/auth";
import * as S from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme } = useAppTheme();

  if (!token) {
    return (
      <S.Container>
        <S.CenterContent>
          <S.Title>Link inválido</S.Title>
          <S.Subtitle>
            O link de redefinição é inválido ou expirou. Solicite novamente.
          </S.Subtitle>
          <S.SubmitButton onPress={() => router.replace("/forgot-password")}>
            <S.SubmitButtonText>Voltar</S.SubmitButtonText>
          </S.SubmitButton>
        </S.CenterContent>
      </S.Container>
    );
  }

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos",
        position: "top",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "A senha deve ter pelo menos 6 caracteres",
        position: "top",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As senhas não coincidem",
        position: "top",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, password);

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: response?.message || "Senha redefinida com sucesso!",
        position: "top",
      });

      router.replace("/login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2:
          err?.response?.data?.message ||
          "Token inválido ou expirado. Solicite novamente.",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Stack.Screen options={{ title: "Redefinir Senha" }} />

        <S.Container>
          <S.Header>
            <S.BackButton onPress={() => router.replace("/login")}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </S.BackButton>
            <S.HeaderTitle>Redefinir Senha</S.HeaderTitle>
            <View style={{ width: 40 }} />
          </S.Header>

          <S.FormContainer>
            <S.Title>Crie uma nova senha</S.Title>
            <S.Subtitle>
              Digite sua nova senha abaixo para continuar
            </S.Subtitle>

            <S.InputGroup>
              <S.Label>Nova senha</S.Label>
              <S.InputWrapper>
                <S.IconWrapper>
                  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.accent} />
                </S.IconWrapper>
                <S.StyledInput
                  placeholder="••••••••"
                  placeholderTextColor="#718096"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <S.EyeButton onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94a3b8"
                  />
                </S.EyeButton>
              </S.InputWrapper>
              <S.HintText>Mínimo 6 caracteres</S.HintText>
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>Confirmar senha</S.Label>
              <S.InputWrapper>
                <S.IconWrapper>
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                </S.IconWrapper>
                <S.StyledInput
                  placeholder="••••••••"
                  placeholderTextColor="#718096"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                />
              </S.InputWrapper>
            </S.InputGroup>

            <S.SubmitButton onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <S.SubmitButtonText>Redefinir senha</S.SubmitButtonText>
              )}
            </S.SubmitButton>
          </S.FormContainer>
        </S.Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
