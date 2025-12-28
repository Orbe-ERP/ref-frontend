import React, { useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerAccount } from '@/services/account';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from './styles';

interface SignUpFormProps {
  onSuccess?: (email: string) => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Preencha todos os campos',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (formData.name.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'O nome deve ter pelo menos 2 caracteres',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (formData.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'A senha deve ter pelo menos 6 caracteres',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    
    if (!hasUpperCase || !hasNumber) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'A senha precisa ter uma letra maiúscula e um número',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await registerAccount(formData);
      
      await AsyncStorage.multiSet([
        ['temp_token', response.token],
        ['user_email', formData.email],
        ['user_id', response.user.id],
        ['user_name', formData.name],
        ['subscription_password', formData.password],
      ]);
      
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Conta criada com sucesso!',
        position: 'top',
        visibilityTime: 2000,
      });
      
      if (onSuccess) {
        onSuccess(formData.email);
      }
      
      router.push('/plans');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: err.message || 'Erro ao criar conta',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <S.Header>
            <S.BackButton onPress={() => router.replace("/login")}>
              <Ionicons name="arrow-back-outline" size={24} color={theme.colors.text.primary} />
            </S.BackButton>
            <S.HeaderTitle>Crie sua conta</S.HeaderTitle>
            <View style={{ width: 40 }} />
          </S.Header>

          <S.FormContainer>
            {/* Nome */}
            <S.InputGroup>
              <S.Label>Nome completo</S.Label>
              <S.InputWrapper>
                <S.IconWrapper>
                  <Ionicons name="person-outline" size={20} color={theme.colors.text.muted} />
                </S.IconWrapper>
                <S.StyledInput
                  placeholder="Seu nome"
                  placeholderTextColor={theme.colors.text.muted}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </S.InputWrapper>
              <S.HintText>Mínimo 2 caracteres</S.HintText>
            </S.InputGroup>

            {/* Email */}
            <S.InputGroup>
              <S.Label>E-mail</S.Label>
              <S.InputWrapper>
                <S.IconWrapper>
                  <Ionicons name="mail-outline" size={20} color={theme.colors.text.muted} />
                </S.IconWrapper>
                <S.StyledInput
                  placeholder="seu@email.com"
                  placeholderTextColor={theme.colors.text.muted}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </S.InputWrapper>
            </S.InputGroup>

            {/* Senha */}
            <S.InputGroup>
              <S.Label>Senha</S.Label>
              <S.InputWrapper>
                <S.IconWrapper>
                  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.muted} />
                </S.IconWrapper>
                <S.StyledInput
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.text.muted}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <S.EyeButton onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={theme.colors.text.muted} 
                  />
                </S.EyeButton>
              </S.InputWrapper>
              <S.HintText>
                Mínimo 6 caracteres, com uma letra maiúscula e um número
              </S.HintText>
            </S.InputGroup>

            {/* Erro */}
            {error && (
              <S.ErrorContainer>
                <S.ErrorText>{error}</S.ErrorText>
              </S.ErrorContainer>
            )}

            {/* Botão de cadastro */}
            <S.SubmitButton onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <S.SubmitButtonText>Criar conta</S.SubmitButtonText>
              )}
            </S.SubmitButton>

            {/* Link para login */}
            <S.LoginContainer>
              <S.LoginText>Já tem uma conta? </S.LoginText>
              <S.LoginButton onPress={() => router.push('/login')}>
                <S.LoginButtonText>Faça login</S.LoginButtonText>
              </S.LoginButton>
            </S.LoginContainer>
          </S.FormContainer>

          {/* Termos */}
          <S.TermsContainer>
            <S.TermsText>
              Ao continuar, você concorda com nossos{' '}
              <S.TermsLink>Termos de Serviço</S.TermsLink> e{' '}S.
              <S.TermsLink>Política de Privacidade</S.TermsLink>
            </S.TermsText>
          </S.TermsContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </S.Container>
  );
}
