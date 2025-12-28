import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import { startSubscription } from '@/services/subscription';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import * as S from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLANS_DATA = [
  {
    id: 'basic',
    name: 'Starter',
    price: 149,
    interval: 'month',
    priceId: 'price_basic_monthly',
    features: [
      'Mesas e Comandas ilimitadas',
      'Categorias, Produtos e Observações',
      'Até 3 usuários',
      'Relatórios básicos',
      'Suporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    interval: 'month',
    priceId: 'price_pro_monthly',
    features: [
      'Tudo do Starter',
      'Mesas, Comandas e Delivery',
      'Estoque Completo + Compras',
      'Relatório + Taxas de cartão',
      'Até 10 usuários',
      '5 restaurantes',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 499,
    interval: 'month',
    priceId: 'price_enterprise_monthly',
    features: [
      'Tudo do Pro',
      'Usuários ilimitados',
      'Restaurantes ilimitados',
      'Relatórios personalizados',
      'Insumos/Ficha técnica',
      'Dashboard avançado',
      'Suporte 24/7',
    ],
  },
];

export default function PlansSelection() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>('pro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedPlan) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Selecione um plano para continuar',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
        const email = await AsyncStorage.getItem('user_email');
        const password = await AsyncStorage.getItem('subscription_password');
        const selectedPlanData = PLANS_DATA.find(p => p.id === selectedPlan);

        if (!email || !password) {
            throw new Error('Credenciais não encontradas. Faça o cadastro novamente.');
        }
        
        if (!selectedPlanData) {
            throw new Error('Plano não encontrado');
        }

        const { url } = await startSubscription({
            priceId: selectedPlanData.priceId,
            email,
            password
        });
      
        Toast.show({
            type: 'info',
            text1: 'Redirecionando',
            text2: 'Abrindo tela de pagamento...',
            position: 'top',
            visibilityTime: 2000,
        });
      
        await Linking.openURL(url);
    } catch (err: any) {
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: err.message || 'Erro ao iniciar assinatura',
            position: 'top',
            visibilityTime: 4000,
        });
    } finally {
        setLoading(false);
    }
  };

  const selectedPlanData = PLANS_DATA.find(p => p.id === selectedPlan);

  return (
    <S.Container>
      {/* Header */}
      <S.Header>
        <S.BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={theme.colors.text.primary} />
        </S.BackButton>
        <S.HeaderTitle>Escolha seu plano</S.HeaderTitle>
        <View style={{ width: 40 }} />
      </S.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <S.Content>
          <S.TitleContainer>
            <S.Title>Encontre o plano perfeito</S.Title>
            <S.Subtitle>
              Comece com 14 dias grátis. Cancele a qualquer momento.
            </S.Subtitle>
          </S.TitleContainer>

          {error && (
            <S.ErrorContainer>
              <S.ErrorText>{error}</S.ErrorText>
            </S.ErrorContainer>
          )}

          {/* Planos */}
          <S.PlansGrid>
            {PLANS_DATA.map((plan) => (
              <S.PlanCard
                key={plan.id}
                recommended={plan.recommended}
                selected={selectedPlan === plan.id}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.recommended && (
                  <S.RecommendedBadge>
                    <Ionicons name="sparkles-outline" size={14} color={theme.colors.surface} />
                    <S.RecommendedText>Recomendado</S.RecommendedText>
                  </S.RecommendedBadge>
                )}

                <S.PlanHeader>
                  <S.PlanName selected={selectedPlan === plan.id}>
                    {plan.name}
                  </S.PlanName>
                  <S.PlanPrice selected={selectedPlan === plan.id}>
                    R$ {plan.price}
                    <S.Interval>/mês</S.Interval>
                  </S.PlanPrice>
                </S.PlanHeader>

                <S.PlanFeatures>
                  {plan.features.map((feature, index) => (
                    <S.FeatureItem key={index}>
                      <Ionicons 
                        name="checkmark-circle-outline" 
                        size={16} 
                        color={selectedPlan === plan.id ? theme.colors.primary : theme.colors.feedback.success} 
                      />
                      <S.FeatureText>{feature}</S.FeatureText>
                    </S.FeatureItem>
                  ))}
                </S.PlanFeatures>
              </S.PlanCard>
            ))}
          </S.PlansGrid>

          {/* Resumo do plano selecionado */}
          {selectedPlanData && (
            <S.SelectedPlanSummary>
              <S.SummaryHeader>
                <S.SummaryTitle>Plano selecionado</S.SummaryTitle>
                <S.SummaryPrice>
                  R$ {selectedPlanData.price}/{selectedPlanData.interval === 'month' ? 'mês' : 'ano'}
                </S.SummaryPrice>
              </S.SummaryHeader>
              <S.SummaryName>{selectedPlanData.name}</S.SummaryName>
              
              <S.ContinueButton onPress={handleContinue} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={theme.colors.surface} />
                ) : (
                  <>
                    <S.ContinueButtonText>Continuar para pagamento</S.ContinueButtonText>
                    <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.surface} />
                  </>
                )}
              </S.ContinueButton>
            </S.SelectedPlanSummary>
          )}

          {/* Informações de segurança */}
          <S.SecurityInfo>
            <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.feedback.success} />
            <S.SecurityText>
              Pagamento 100% seguro processado por Stripe. Seus dados estão protegidos.
            </S.SecurityText>
          </S.SecurityInfo>

          {/* Observações */}
          <S.NotesContainer>
            <S.NoteText>• 7 dias de teste gratuito</S.NoteText>
            <S.NoteText>• Cancele quando quiser</S.NoteText>
            <S.NoteText>• Nenhum compromisso</S.NoteText>
          </S.NotesContainer>
        </S.Content>
      </ScrollView>
    </S.Container>
  );
}
