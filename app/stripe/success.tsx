import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as S from './styles';

export default function StripeSuccess() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { session_id } = useLocalSearchParams();

  // Opcional: Aqui você poderia chamar um serviço para validar o status
  // mas como o Webhook cuidará do backend, basta dar as boas-vindas.

  return (
    <S.Container>
      <S.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginBottom: 24 }}>
          <Ionicons name="checkmark-circle" size={100} color={theme.colors.feedback.success} />
        </View>

        <S.TitleContainer>
          <S.Title>Pagamento Confirmado!</S.Title>
          <S.Subtitle>
            Parabéns! Sua assinatura foi processada com sucesso. 
            Você já tem acesso a todos os recursos do seu plano.
          </S.Subtitle>
        </S.TitleContainer>

        <S.SecurityInfo style={{ width: '100%', marginBottom: 32 }}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.feedback.success} />
          <S.SecurityText>
            ID da Sessão: {session_id?.toString().substring(0, 20)}...
          </S.SecurityText>
        </S.SecurityInfo>

        <S.ContinueButton 
          onPress={() => router.replace('/(tabs)')}
          style={{ width: '100%' }}
        >
          <S.ContinueButtonText>Começar a usar agora</S.ContinueButtonText>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.surface} />
        </S.ContinueButton>
      </S.Content>
    </S.Container>
  );
}