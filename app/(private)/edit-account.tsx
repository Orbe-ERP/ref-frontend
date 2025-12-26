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

const TABS = {
  GENERAL: "Dados Gerais",
  PLANS: "Planos",
} as const;

type TabType = keyof typeof TABS;

export default function AccountEditScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("GENERAL");
  const { theme } = useAppTheme();
  const navigation = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!currentPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Informe sua senha atual para atualizar os dados.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As senhas não coincidem.",
        position: "top",
        visibilityTime: 3000,
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
        text2: "Para a atualização ser efetivada, por favor, faça login novamente.",
        position: "top",
        visibilityTime: 2000,
      });

      logout();
      navigation.back();
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível atualizar os dados.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPlansContent = () => {
    // Aqui você pode implementar a lógica de planos
    // Exemplo de planos disponíveis
    const plans = [
      {
        id: "basic",
        name: "Básico",
        price: "R$ 49,90/mês",
        features: [
          "Até 3 usuários",
          "2 restaurantes",
          "Relatórios básicos",
          "Suporte por email",
        ],
        current: true,
      },
      {
        id: "pro",
        name: "Profissional",
        price: "R$ 99,90/mês",
        features: [
          "Até 10 usuários",
          "5 restaurantes",
          "Relatórios avançados",
          "Suporte prioritário",
          "Integração com marketplaces",
        ],
        current: false,
      },
      {
        id: "enterprise",
        name: "Empresarial",
        price: "R$ 199,90/mês",
        features: [
          "Usuários ilimitados",
          "Restaurantes ilimitados",
          "Relatórios personalizados",
          "Suporte 24/7",
          "API exclusiva",
          "Treinamento personalizado",
        ],
        current: false,
      },
    ];

    return (
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
                  <FeatureIcon current={plan.current}>
                    ✓
                  </FeatureIcon>
                  <FeatureText>{feature}</FeatureText>
                </PlanFeature>
              ))}
            </PlanFeatures>
            
            <PlanButton 
              current={plan.current}
              onPress={() => {
                if (!plan.current) {
                  // Lógica para alterar o plano
                  Toast.show({
                    type: "info",
                    text1: "Alterar Plano",
                    text2: `Você selecionou o plano ${plan.name}`,
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
        
        <InfoCard>
          <InfoTitle>Informações importantes</InfoTitle>
          <InfoText>
            • A alteração de plano entra em vigor no próximo ciclo de faturamento
          </InfoText>
          <InfoText>
            • Não há cobranças extras por mudança de plano
          </InfoText>
          <InfoText>
            • Para cancelar seu plano, entre em contato com nosso suporte
          </InfoText>
        </InfoCard>
      </PlansContainer>
    );
  };

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
        {/* Tabs de navegação */}
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
  border-width: 2;
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
  border-width: 2;
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
  border-left-width: 4;
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