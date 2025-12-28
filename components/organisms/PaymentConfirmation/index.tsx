import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import { confirmPayment } from '@/services/subscription';
import Toast from 'react-native-toast-message';
import * as S from './styles';

export default function PaymentConfirmation() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUserEmail = async () => {
      const email = await AsyncStorage.getItem('user_email');
      setUserEmail(email);
    };
    loadUserEmail();
  }, []);

  const handleRetry = useCallback(async () => {
    const token = params.token as string;
    if (!token) return;
    
    setStatus('loading');
    setMessage('');
    
    try {
      const result = await confirmPayment(token);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        
        await AsyncStorage.multiRemove(['temp_token', 'user_email']);
        
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Pagamento confirmado!',
          position: 'top',
          visibilityTime: 2000,
        });
        
        setTimeout(() => {
          router.replace({
            pathname: '/login',
            params: { 
              message: 'Pagamento confirmado! Faça login para acessar sua conta.',
              email: userEmail || ''
            }
          });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
        
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: result.message,
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Erro ao tentar novamente');
      
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message || 'Erro ao tentar novamente',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }, [params.token, router, userEmail]);

  useEffect(() => {
    const processPayment = async () => {
      const token = params.token as string;
    
      if (!token) {
        setStatus('error');
        setMessage('Token de pagamento não encontrado');
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Token de pagamento não encontrado',
          position: 'top',
          visibilityTime: 4000,
        });
        return;
      }

      try {
        const result = await confirmPayment(token);
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message);
        
          await AsyncStorage.multiRemove(['temp_token', 'user_email']);
        
          Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: 'Pagamento confirmado! Redirecionando...',
            position: 'top',
            visibilityTime: 2000,
          });
        
          setTimeout(() => {
            const email = result.user?.email || userEmail;
            router.replace({
              pathname: '/login',
              params: { 
                prefillEmail: email || '',
                message: 'Assinatura ativada! Faça login para começar.'
              }
            });
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Erro ao confirmar pagamento');
          
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: result.message || 'Erro ao confirmar pagamento',
            position: 'top',
            visibilityTime: 4000,
          });
        }
      } catch (error: any) {
        console.error('Payment confirmation error:', error);
        
        setStatus('error');
        setMessage(error.message || 'Erro ao processar pagamento');
        
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: error.message || 'Erro ao processar pagamento',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    };

    processPayment();
  }, [params.token, router, userEmail]); // Adicionei router e userEmail nas dependências

  return (
    <S.Container>
      <S.Content>
        {status === 'loading' && (
          <S.StatusContainer>
            <ActivityIndicator size={64} color={theme.colors.primary} />

            <S.StatusTitle>Confirmando seu pagamento</S.StatusTitle>

            <S.StatusDescription>
              Aguarde enquanto processamos sua assinatura...
            </S.StatusDescription>

            <S.SecurityInfo>
              <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.feedback.success} />
              <S.SecurityText>Processamento seguro</S.SecurityText>
            </S.SecurityInfo>
          </S.StatusContainer>
        )}

        {status === 'success' && (
          <S.StatusContainer>
            <S.SuccessIcon>
              <Ionicons name="checkmark-circle" size={80} color={theme.colors.feedback.success} />
            </S.SuccessIcon>
            <S.StatusTitle>Pagamento confirmado! 🎉</S.StatusTitle>
            <S.StatusDescription>
              {message || 'Sua assinatura foi ativada com sucesso!'}
            </S.StatusDescription>
            <S.RedirectText>
              Redirecionando para o login...
            </S.RedirectText>
          </S.StatusContainer>
        )}

        {status === 'error' && (
          <S.StatusContainer>
            <S.ErrorIcon>
              <Ionicons name="close-circle" size={80} color={theme.colors.feedback.error} />
            </S.ErrorIcon>
            <S.StatusTitle>Erro no pagamento</S.StatusTitle>
            <S.StatusDescription>
              {message || 'Não foi possível confirmar seu pagamento.'}
            </S.StatusDescription>
            
            <S.ButtonGroup>
              <S.RetryButton onPress={handleRetry}>
                <S.RetryButtonText>Tentar novamente</S.RetryButtonText>
              </S.RetryButton>
              <S.PlanButton onPress={() => router.push('/plans')}>
                <S.PlanButtonText>Escolher outro plano</S.PlanButtonText>
              </S.PlanButton>
              <S.HomeButton onPress={() => router.replace('/')}>
                <S.HomeButtonText>Voltar para início</S.HomeButtonText>
              </S.HomeButton>
            </S.ButtonGroup>
          </S.StatusContainer>
        )}
      </S.Content>
    </S.Container>
  );
}