import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { useAppTheme } from '@/context/ThemeProvider/theme';
import { confirmEmail, resendConfirmEmail } from '@/services/auth';

import * as S from './styles';

type Status = 'loading' | 'success' | 'error';

export default function EmailConfirmationScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { token, email } = useLocalSearchParams<{
    token?: string;
    email?: string;
  }>();

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de confirmação inválido ou ausente');
      return;
    }

    confirmEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);

        Toast.show({
          type: 'success',
          text1: 'E-mail confirmado',
          text2: res.message,
          position: 'top',
        });

        setTimeout(() => {
          router.replace('/login');
        }, 2500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);

        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: err.message,
          position: 'top',
        });
      });
  }, [router, token]);

  const handleResend = useCallback(async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'E-mail não informado',
      });
      return;
    }

    try {
      const res = await resendConfirmEmail(email);

      Toast.show({
        type: 'success',
        text1: 'E-mail reenviado',
        text2: res.message,
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: err.message,
      });
    }
  }, [email]);

  return (
    <S.Container>
      <S.Content>
        {status === 'loading' && (
          <S.StatusContainer>
            <ActivityIndicator size={64} color={theme.colors.primary} />

            <S.StatusTitle>Confirmando seu e-mail</S.StatusTitle>

            <S.StatusDescription>
              Aguarde enquanto validamos sua conta...
            </S.StatusDescription>

            <S.SecurityInfo>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={theme.colors.feedback.success}
              />
              <S.SecurityText>Processo seguro</S.SecurityText>
            </S.SecurityInfo>
          </S.StatusContainer>
        )}

        {status === 'success' && (
          <S.StatusContainer>
            <S.SuccessIcon>
              <Ionicons
                name="checkmark-circle"
                size={80}
                color={theme.colors.feedback.success}
              />
            </S.SuccessIcon>

            <S.StatusTitle>E-mail confirmado 🎉</S.StatusTitle>

            <S.StatusDescription>
              Sua conta foi ativada com sucesso.
            </S.StatusDescription>

            <S.RedirectText>
              Redirecionando para o login...
            </S.RedirectText>
          </S.StatusContainer>
        )}

        {status === 'error' && (
          <S.StatusContainer>
            <S.ErrorIcon>
              <Ionicons
                name="close-circle"
                size={80}
                color={theme.colors.feedback.error}
              />
            </S.ErrorIcon>

            <S.StatusTitle>Erro na confirmação</S.StatusTitle>

            <S.StatusDescription>
              {message}
            </S.StatusDescription>

            <S.ButtonGroup>
              <S.PrimaryButton onPress={() => router.replace('/login')}>
                <S.PrimaryButtonText>Ir para login</S.PrimaryButtonText>
              </S.PrimaryButton>

              {email && (
                <S.SecondaryButton onPress={handleResend}>
                  <S.SecondaryButtonText>
                    Reenviar e-mail
                  </S.SecondaryButtonText>
                </S.SecondaryButton>
              )}
            </S.ButtonGroup>
          </S.StatusContainer>
        )}
      </S.Content>
    </S.Container>
  );
}
