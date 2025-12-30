import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Linking } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

import { useAppTheme } from "@/context/ThemeProvider/theme";
import useAuth from "@/hooks/useAuth";

import { getPlans, Plan } from "@/services/plans";
import {
  startSubscription,
  getMySubscription,
  SubscriptionData,
} from "@/services/subscription";

import * as S from "./styles";
import { LoadingContainer } from "@/components/pages/ClosedOrder/styles";

const PLAN_FEATURES: Record<Plan["name"], string[]> = {
  starter: [
    "Mesas e Comandas ilimitadas",
    "Categorias, Produtos e Observações",
    "Até 3 usuários",
    "Relatórios básicos",
    "Suporte por email",
  ],
  pro: [
    "Tudo do Starter",
    "Mesas, Comandas e Delivery",
    "Estoque completo + Compras",
    "Até 10 usuários",
    "Relatórios avançados",
    "Suporte prioritário",
  ],
  enterprise: [
    "Tudo do Pro",
    "Usuários ilimitados",
    "Restaurantes ilimitados",
    "Relatórios personalizados",
    "Dashboard avançado",
    "Suporte 24/7",
  ],
};

export default function PlansSelection() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const auth = useAuth();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionData | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const canSeeCurrentPlan = auth.user?.role !== "USER";

  useEffect(() => {
    async function loadData() {
      try {
        const [plansData, subscription] = await Promise.all([
          getPlans(),
          getMySubscription(),
        ]);

        setPlans(plansData);
        setCurrentSubscription(subscription);

        if (subscription?.priceId) {
          setSelectedPlan(subscription.priceId);
        }
      } catch {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Erro ao carregar planos",
        });
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  const handleContinue = async () => {
    try {
      if (!selectedPlan) return;

      if (selectedPlan === currentSubscription?.priceId) {
        return;
      }

      const email = auth.user?.email;
      if (!email) {
        throw new Error("Usuário não autenticado");
      }

      setLoading(true);

      const { url } = await startSubscription({
        priceId: selectedPlan,
        email,
      });

      Toast.show({
        type: "info",
        text1: "Redirecionando",
        text2: "Abrindo pagamento...",
      });

      await Linking.openURL(url);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err.message || "Erro ao iniciar assinatura",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  return (
    <S.Container>
      {/* Header */}
      <S.Header>
        <S.BackButton onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={theme.colors.text.primary}
          />
        </S.BackButton>
        <S.HeaderTitle>Escolha seu plano</S.HeaderTitle>
        <View style={{ width: 40 }} />
      </S.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <S.Content>
          <S.TitleContainer>
            <S.Title>Encontre o plano perfeito</S.Title>
            <S.Subtitle>14 dias grátis. Cancele quando quiser.</S.Subtitle>
          </S.TitleContainer>

          {/* Planos */}
          <S.PlansGrid>
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isCurrentPlan =
                canSeeCurrentPlan && currentSubscription?.priceId === plan.id;

              return (
                <S.PlanCard
                  key={plan.id}
                  selected={isSelected}
                  recommended={plan.name === "pro"}
                  disabled={canSeeCurrentPlan && isCurrentPlan}
                  onPress={() => {
                    if (!isCurrentPlan) {
                      setSelectedPlan(plan.id);
                    }
                  }}
                >
                  {isCurrentPlan && (
                    <S.CurrentPlanBadge>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color="#fff"
                      />
                      <S.CurrentPlanText>Plano atual</S.CurrentPlanText>
                    </S.CurrentPlanBadge>
                  )}

                  {plan.name === "pro" && (
                    <S.RecommendedBadge>
                      <Ionicons
                        name="sparkles-outline"
                        size={14}
                        color={theme.colors.surface}
                      />
                      <S.RecommendedText>Recomendado</S.RecommendedText>
                    </S.RecommendedBadge>
                  )}

                  <S.PlanHeader>
                    <S.PlanName selected={isSelected}>
                      {plan.name === "starter"
                        ? "Starter"
                        : plan.name === "pro"
                        ? "Pro"
                        : "Empresarial"}
                    </S.PlanName>

                    <S.PlanPrice selected={isSelected}>
                      R$ {(plan.amount / 100).toFixed(2)}
                      <S.Interval>/mês</S.Interval>
                    </S.PlanPrice>
                  </S.PlanHeader>

                  <S.PlanFeatures>
                    {PLAN_FEATURES[plan.name].map((feature, index) => (
                      <S.FeatureItem key={index}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color={
                            isSelected
                              ? theme.colors.primary
                              : theme.colors.feedback.success
                          }
                        />
                        <S.FeatureText>{feature}</S.FeatureText>
                      </S.FeatureItem>
                    ))}
                  </S.PlanFeatures>
                </S.PlanCard>
              );
            })}
          </S.PlansGrid>

          {/* Resumo */}
          {selectedPlanData && (
            <S.SelectedPlanSummary>
              <S.SummaryHeader>
                <S.SummaryTitle>Plano selecionado</S.SummaryTitle>
                <S.SummaryPrice>
                  R$ {(selectedPlanData.amount / 100).toFixed(2)}
                  /mês
                </S.SummaryPrice>
              </S.SummaryHeader>

              <S.SummaryName>
                {selectedPlanData.name.toUpperCase()}
              </S.SummaryName>

              {currentSubscription &&
                selectedPlan === currentSubscription.priceId && (
                  <S.SubscriptionInfo>
                    <Ionicons name="calendar-outline" size={16} />
                    <S.SubscriptionText>
                      Próxima renovação em{" "}
                      {dayjs(currentSubscription.currentPeriodEnd).format(
                        "DD/MM/YYYY"
                      )}
                    </S.SubscriptionText>
                  </S.SubscriptionInfo>
                )}

              <S.ContinueButton
                onPress={handleContinue}
                disabled={
                  loading || selectedPlan === currentSubscription?.priceId
                }
              >
                {selectedPlan === currentSubscription?.priceId ? (
                  <S.ContinueButtonText>Plano atual</S.ContinueButtonText>
                ) : loading ? (
                  <ActivityIndicator color={theme.colors.surface} />
                ) : (
                  <>
                    <S.ContinueButtonText>
                      Continuar para pagamento
                    </S.ContinueButtonText>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={theme.colors.surface}
                    />
                  </>
                )}
              </S.ContinueButton>
            </S.SelectedPlanSummary>
          )}

          <S.SecurityInfo>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.colors.feedback.success}
            />
            <S.SecurityText>Pagamento 100% seguro via Stripe.</S.SecurityText>
          </S.SecurityInfo>
        </S.Content>
      </ScrollView>
    </S.Container>
  );
}
