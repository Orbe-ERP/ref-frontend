import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as S from './styles';

export default function StripeCancel() {
  const { theme } = useAppTheme();
  const router = useRouter();

  return (
    <S.Container>
      <S.Content
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ marginBottom: 24 }}>
          <Ionicons
            name="close-circle-outline"
            size={100}
            color={theme.colors.feedback.error}
          />
        </View>

        <S.TitleContainer>
          <S.Title>Pagamento não concluído</S.Title>
          <S.Subtitle>
            A operação foi cancelada e nenhuma cobrança foi realizada.
            Se houve algum problema com seu cartão, você pode tentar novamente.
          </S.Subtitle>
        </S.TitleContainer>

        <S.ContinueButton
          onPress={() => router.replace('/plans')}
          style={{
            width: '100%',
            backgroundColor: theme.colors.text.primary,
          }}
        >
          <S.ContinueButtonText>
            Tentar novamente
          </S.ContinueButtonText>
          <Ionicons
            name="refresh-outline"
            size={18}
            color={theme.colors.surface}
          />
        </S.ContinueButton>

        <S.BackButton
          onPress={() => router.replace('/')}
          style={{
            marginTop: 20,
            width: 'auto',
            paddingHorizontal: 20,
          }}
        >
          <S.FeatureText style={{ textAlign: 'center' }}>
            Voltar ao início
          </S.FeatureText>
        </S.BackButton>
      </S.Content>
    </S.Container>
  );
}