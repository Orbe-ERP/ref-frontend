import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { Stack, useRouter } from "expo-router";
import { UpdateUser, updateUser } from "@/services/user";
import AccountForm from "@/components/organisms/AccountForm";
import useAuth from "@/hooks/useAuth";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import Toast from "react-native-toast-message";
import { getMySubscription, startSubscription } from "@/services/subscription";
import * as Linking from "expo-linking";

const TABS = {
  GENERAL: "Dados Gerais",
  PLANS: "Planos",
} as const;

type TabType = keyof typeof TABS;

const PLANS_CATALOG = [
  {
    id: "basic",
    name: "Starter",
    price: "R$ 149/mês",
    priceId: "price_basic_123",
    features: [
      "Mesas e Comandas ilimitadas",
      "Categorias, Produtos e Observações",
      "Até 3 usuários",
      "Relatórios básicos",
      "Suporte por email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 299/mês",
    priceId: "price_pro_456",
    features: [
      "Tudo do Starter",
      "Mesas, Comandas e Delivery",
      "Estoque Completo + Compras",
      "Relatório + Taxas de cartão",
      "Até 10 usuários",
      "5 restaurantes",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
  {
    id: "enterprise",
    name: "Empresarial",
    price: "R$ 499/mês",
    priceId: "price_enterprise_789",
    features: [
      "Tudo do Pro",
      "Usuários ilimitados",
      "Restaurantes ilimitados",
      "Relatórios personalizados",
      "Insumos/Ficha técnica",
      "Dashboard avançado",
      "Suporte 24/7",
    ],
  },
];

export default function AccountEditScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("GENERAL");

  const [plans, setPlans] = useState<
    {
      id: string;
      name: string;
      price: string;
      priceId: string;
      features: string[];
      current: boolean;
    }[]
  >([]);

  const { theme } = useAppTheme();
  const navigation = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const subscription = await getMySubscription();

        setPlans(
          PLANS_CATALOG.map((plan) => ({
            ...plan,
            current: plan.id === subscription.plan,
          }))
        );
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar os planos",
        });
      }
    }

    if (activeTab === "PLANS") {
      loadPlans();
    }
  }, [activeTab]);

  const handleSave = async () => {
    if (!currentPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Informe sua senha atual para atualizar os dados.",
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As senhas não coincidem.",
      });
      return;
    }

    try {
      setLoading(true);

      const updateData: UpdateUser = {
        id: user?.id,
        currentPassword,
        ...(name !== user?.name && { name }),
        ...(email !== user?.email && { email }),
        ...(newPassword && { newPassword }),
      };

      await updateUser(updateData);

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Faça login novamente para concluir a atualização.",
      });

      logout();
      navigation.back();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível atualizar os dados.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPlansContent = () => (
    <PlansContainer>
      <PlansTitle>Selecione seu plano</PlansTitle>
      <PlansDescription>
        Escolha o plano que melhor atende às necessidades do seu negócio
      </PlansDescription>

      {plans.map((plan) => (
        <PlanCard key={plan.id} current={plan.current}>
          <PlanHeader>
            <PlanName current={plan.current}>{plan.name}</PlanName>
            <PlanPrice current={plan.current}>{plan.price}</PlanPrice>
          </PlanHeader>

          <PlanFeatures>
            {plan.features.map((feature, index) => (
              <PlanFeature key={index}>
                <FeatureIcon current={plan.current}>✓</FeatureIcon>
                <FeatureText>{feature}</FeatureText>
              </PlanFeature>
            ))}
          </PlanFeatures>

          <PlanButton
            current={plan.current}
            onPress={async () => {
              if (plan.current) return;

              try {
                const { url } = await startSubscription(plan.priceId);
                await Linking.openURL(url);
              } catch {
                Toast.show({
                  type: "error",
                  text1: "Erro",
                  text2: "Não foi possível iniciar a assinatura",
                });
              }
            }}
          >
            <PlanButtonText current={plan.current}>
              {plan.current ? "Plano Atual" : "Selecionar Plano"}
            </PlanButtonText>
          </PlanButton>
        </PlanCard>
      ))}
    </PlansContainer>
  );

  if (!user) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#038082" />
      </LoadingContainer>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Gerenciar Conta",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <Container>
        <TabsContainer>
          {Object.entries(TABS).map(([key, label]) => (
            <TabButton
              key={key}
              active={activeTab === key}
              onPress={() => setActiveTab(key as TabType)}
            >
              <TabText active={activeTab === key}>{label}</TabText>
            </TabButton>
          ))}
        </TabsContainer>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {activeTab === "GENERAL" ? (
              <AccountForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onSave={handleSave}
                loading={loading}
              />
            ) : (
              renderPlansContent()
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </>
  );
}

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px 15px;
`;

const TabsContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  align-items: center;
  border-radius: 8px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${({ active }) => active ? 'bold' : '500'};
  color: ${({ active, theme }) => 
    active ? theme.colors.surface : theme.colors.text.secondary};
`;

// Estilos para a seção de Planos
const PlansContainer = styled.View`
  padding: 10px 0;
`;

const PlansTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  text-align: center;
`;

const PlansDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 24px;
  text-align: center;
`;

const PlanCard = styled.View<{ current: boolean }>`
  background-color: ${({ theme, current }) => 
    current ? theme.colors.primary + '20' : theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-width: 2px;
  border-color: ${({ theme, current }) => 
    current ? theme.colors.primary : theme.colors.border};
`;

const PlanHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PlanName = styled.Text<{ current: boolean }>`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme, current }) => 
    current ? theme.colors.primary : theme.colors.text.primary};
`;

const PlanPrice = styled.Text<{ current: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme, current }) => 
    current ? theme.colors.primary : theme.colors.text.primary};
`;

const PlanFeatures = styled.View`
  margin-bottom: 20px;
`;

const PlanFeature = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const FeatureIcon = styled.Text<{ current: boolean }>`
  color: ${({ theme, current }) => 
    current ? theme.colors.primary : theme.colors.feedback.success};
  font-weight: bold;
  margin-right: 8px;
`;

const FeatureText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  flex: 1;
`;

const PlanButton = styled.TouchableOpacity<{ current: boolean }>`
  background-color: ${({ theme, current }) => 
    current ? theme.colors.primary : theme.colors.surface};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  border-width: 2px;
  border-color: ${({ theme, current }) => 
    current ? theme.colors.primary : theme.colors.primary};
`;

const PlanButtonText = styled.Text<{ current: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme, current }) => 
    current ? theme.colors.surface : theme.colors.primary};
`;

const InfoCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.feedback.info};
`;

const InfoTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 6px;
`;