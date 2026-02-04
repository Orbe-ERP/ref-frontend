import React, { useState, useEffect } from "react";
import { Linking, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import useRestaurant from "@/hooks/useRestaurant";
import { VerticalBarChart } from "@/components/organisms/VerticalBarChart";
import { usePermissions } from "@/hooks/usePermissions";
import { getTodayProductSales } from "@/services/salesService";
import { getOrdersByRestaurant } from "@/services/order";
import { ProductSales } from "@/services/types";
import Button from "@/components/atoms/Button";
import { Ionicons } from "@expo/vector-icons";
import LogoutButton from "@/components/atoms/LogoutButton";
import { ThemeToggle } from "@/components/molecules/ToggleTheme";
import styled from "styled-components/native";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import Title from "@/components/atoms/Title";
import { useResponsive } from "@/hooks/useResponsive";
import useSubscriptionStatus from "@/context/SubscriptionProvider/subscription";
import useAuth from "@/hooks/useAuth";
import { getBillingPortal } from "@/services/subscription";
import Toast from "react-native-toast-message";

interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
  hasMarginTop?: boolean;
}

const Container = styled.View<ResponsiveProps>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};

  ${({ isWeb, isTablet, isDesktop }) =>
    (isTablet || isDesktop) && isWeb
      ? `
    align-items: center;
  `
      : ""}
`;

const ScrollContent = styled(ScrollView).attrs((props: ResponsiveProps) => ({
  contentContainerStyle: {
    padding: props.isMobile ? 16 : 24,
    paddingBottom: 40,
    minHeight: "100%",
    ...(props.isTablet && {
      maxWidth: 800,
      alignSelf: "center",
      width: "100%",
    }),
    ...(props.isDesktop && {
      maxWidth: 1200,
      alignSelf: "center",
      width: "100%",
    }),
  },
}))<ResponsiveProps>``;

const LogoutContainer = styled.View<ResponsiveProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ isMobile }) => (isMobile ? 12 : 20)}px;
  width: 100%;

  ${({ isTablet, isDesktop }) =>
    isTablet || isDesktop
      ? `
    max-width: 800px;
    align-self: center;
  `
    : ""}
`;

const ChartSection = styled.View<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ isMobile }) => (isMobile ? 16 : 20)}px;
  padding: ${({ isMobile }) => (isMobile ? 16 : 24)}px;
  margin-bottom: ${({ isMobile }) => (isMobile ? 20 : 24)}px;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.1);
  width: 100%;
`;

const SectionHeader = styled.View<ResponsiveProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ isMobile }) => (isMobile ? 12 : 16)}px;
  flex-wrap: wrap;
  gap: ${({ isMobile }) => (isMobile ? 8 : 12)}px;
`;

const SectionTitle = styled.Text<ResponsiveProps>`
  font-size: ${({ isMobile, isTablet, isDesktop }) =>
    isMobile ? 16 : isTablet ? 18 : 20}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  min-width: 200px;
`;

const SalesCount = styled.Text<ResponsiveProps>`
  font-size: ${({ isMobile }) => (isMobile ? 14 : 16)}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: right;
`;

const RefreshButton = styled.TouchableOpacity<ResponsiveProps>`
  padding: ${({ isMobile }) => (isMobile ? 6 : 8)}px;
`;

const EmptyState = styled.View<ResponsiveProps>`
  padding: ${({ isMobile }) => (isMobile ? 24 : 32)}px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ isMobile }) => (isMobile ? 12 : 16)}px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
  margin: ${({ isMobile }) => (isMobile ? 0 : 16)}px 0;
`;

const EmptyText = styled.Text<ResponsiveProps>`
  color: ${({ theme }) => theme.colors.text.accent};
  text-align: center;
  margin-bottom: ${({ isMobile }) => (isMobile ? 10 : 16)}px;
  font-size: ${({ isMobile }) => (isMobile ? 14 : 16)}px;
  font-weight: 500;
`;

const StatusSection = styled.View<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ isMobile }) => (isMobile ? 16 : 20)}px;
  padding: ${({ isMobile }) => (isMobile ? 16 : 24)}px;
  flex-direction: row;
  justify-content: space-around;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.1);
  margin-bottom: ${({ isMobile }) => (isMobile ? 20 : 24)}px;
  width: 100%;
`;

const StatusItem = styled.View`
  align-items: center;
  flex: 1;
`;

const StatusLabel = styled.Text<ResponsiveProps>`
  font-size: ${({ isMobile }) => (isMobile ? 11 : 13)}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ isMobile }) => (isMobile ? 4 : 6)}px;
  font-weight: 500;
`;

const StatusValue = styled.Text<ResponsiveProps>`
  font-size: ${({ isMobile }) => (isMobile ? 14 : 18)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionsRow = styled.View<ResponsiveProps>`
  flex-direction: row;
  gap: ${({ isMobile }) => (isMobile ? 8 : 12)}px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${({ hasMarginTop }) => (hasMarginTop ? "16px" : "0")};
`;

const MenuSection = styled.View<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ isMobile }) => (isMobile ? 10 : 16)}px;
  padding: ${({ isMobile }) => (isMobile ? 10 : 20)}px;
  margin-bottom: ${({ isMobile }) => (isMobile ? 16 : 24)}px;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.08);
  width: 100%;
`;

const MenuColumn = styled.View<ResponsiveProps>`
  flex-direction: column;
  gap: ${({ isMobile }) => (isMobile ? 6 : 10)}px;
  margin-top: ${({ isMobile }) => (isMobile ? 8 : 12)}px;

  ${({ isTablet, isDesktop }) =>
    isTablet || isDesktop
      ? `
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  `
      : ""}
`;

const GridContainer = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) =>
    isTablet || isDesktop
      ? `
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
    margin-top: 16px;
  `
      : ""}
`;

const GridItem = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) =>
    isTablet || isDesktop
      ? `
    flex: ${isTablet ? "1 0 45%" : "1 0 30%"};
    min-width: ${isTablet ? "300px" : "350px"};
  `
      : ""}
`;

const ButtonWrapper = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) =>
    isTablet || isDesktop
      ? `
    flex: 1;
    min-width: 200px;
  `
      : ""}
`;

export const SubscriptionTimerText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.warning};
  font-weight: 600;
  font-size: 14px;
`;

export const SubscriptionTimer = styled.View`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.feedback.warning + "20"};
  border: 1px solid ${({ theme }) => theme.colors.feedback.warning};

  margin-bottom: 16px;
`;

interface VerticalBarChartWrapperProps {
  data: ProductSales[];
  scale?: number;
}

const VerticalBarChartWrapper: React.FC<VerticalBarChartWrapperProps> = ({
  data,
  scale = 1,
}) => {
  return <VerticalBarChart data={data} />;
};

export default function IndexScreen() {
  const [salesData, setSalesData] = useState<ProductSales[]>([]);
  const { status, loadingStatus } = useSubscriptionStatus();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRestaurant } = useRestaurant();
  const {
    canAccessDashboard,
    canAccessReports,
    canAccessKitchen,
    canViewAdvancedCharts,
  } = usePermissions();
  const router = useRouter();
  const { theme } = useAppTheme();

  const { isMobile, isTablet, isDesktop, isWeb } = useResponsive();

  useEffect(() => {
    if (selectedRestaurant?.id) loadSalesData();
    else setLoading(false);
  }, [selectedRestaurant?.id]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedRestaurant?.id) {
        setError("Nenhum restaurante selecionado");
        return;
      }

      const orders = await getOrdersByRestaurant(
        selectedRestaurant.id,
        "COMPLETED"
      );

      const todayProductSales = getTodayProductSales(orders);

      setSalesData(todayProductSales);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados de vendas");
    } finally {
      setLoading(false);
    }
  };

async function handleOpenBillingPortal() {
  try {
    const { url } = await getBillingPortal();

    if (!url) {
      throw new Error("URL do portal não retornada");
    }

    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      throw new Error("Não foi possível abrir o portal");
    }

    await Linking.openURL(url);
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Erro",
      text2: error.message || "Erro ao abrir portal de faturamento",
    });
  }
}


  const refreshData = () => {
    if (selectedRestaurant?.id) loadSalesData();
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.salesCount, 0);
  const totalProducts = salesData.length;

  return (
    <Container isWeb={isWeb} isTablet={isTablet} isDesktop={isDesktop}>
      <Stack.Screen
        options={{
          title: "Início",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            color: theme.colors.text.primary,
            fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
          },
        }}
      />

      {user?.role === "ADMIN" && status?.isExpiringSoon && (
        <SubscriptionTimer>
          Seu plano expira em {status.expiresInDays} dias
        </SubscriptionTimer>
      )}
      <ScrollContent
        showsVerticalScrollIndicator={isWeb}
        isMobile={isMobile}
        isTablet={isTablet}
        isDesktop={isDesktop}
      >
        <LogoutContainer
          isMobile={isMobile}
          isTablet={isTablet}
          isDesktop={isDesktop}
        >
          <ThemeToggle />
          <Title variant="restaurant">
            {selectedRestaurant?.name || "Nenhum restaurante selecionado"}
          </Title>
          <LogoutButton />
        </LogoutContainer>

        <GridContainer isTablet={isTablet} isDesktop={isDesktop}>
          {canViewAdvancedCharts && (
            <GridItem isTablet={isTablet} isDesktop={isDesktop}>
              <ChartSection
                isMobile={isMobile}
                isTablet={isTablet}
                isDesktop={isDesktop}
              >
                <SectionHeader isMobile={isMobile}>
                  <SectionTitle
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isDesktop={isDesktop}
                  >
                    📊 Pratos Mais Vendidos Hoje
                  </SectionTitle>
                  <ActionsRow isMobile={isMobile}>
                    {selectedRestaurant && (
                      <SalesCount isMobile={isMobile}>
                        {totalProducts}{" "}
                        {totalProducts === 1 ? "produto" : "produtos"}{" "}
                        diferentes vendidos
                      </SalesCount>
                    )}
                    <RefreshButton
                      isMobile={isMobile}
                      onPress={refreshData}
                      disabled={loading}
                    >
                      <Ionicons
                        name="refresh"
                        size={isMobile ? 20 : 24}
                        color={theme.colors.accent}
                      />
                    </RefreshButton>
                  </ActionsRow>
                </SectionHeader>

                {!selectedRestaurant ? (
                  <EmptyState isMobile={isMobile}>
                    <EmptyText isMobile={isMobile}>
                      Selecione um restaurante para ver as vendas
                    </EmptyText>
                    <Button
                      label="🍴 Selecionar Restaurante"
                      onPress={() =>
                        router.push("/(private)/select-restaurant")
                      }
                    />
                  </EmptyState>
                ) : loading ? (
                  <EmptyText isMobile={isMobile}>
                    Carregando vendas...
                  </EmptyText>
                ) : error ? (
                  <EmptyText isMobile={isMobile}>{error}</EmptyText>
                ) : (
                  <>
                    <VerticalBarChartWrapper
                      data={salesData}
                      scale={isDesktop ? 0.9 : isTablet ? 0.95 : 1}
                    />

                    {canAccessDashboard && (
                      <ActionsRow isMobile={isMobile} hasMarginTop>
                        <Button
                        variant="primary"
                          label="Dashboard"
                          onPress={() => router.push("/(private)/dashboard")}
                        />
                      </ActionsRow>
                    )}
                  </>
                )}
              </ChartSection>
            </GridItem>
          )}

          <GridItem isTablet={isTablet} isDesktop={isDesktop}>
            <MenuSection
              isMobile={isMobile}
              isTablet={isTablet}
              isDesktop={isDesktop}
            >
              <MenuColumn
                isMobile={isMobile}
                isTablet={isTablet}
                isDesktop={isDesktop}
              >
                {canAccessKitchen && (
                  <ButtonWrapper isTablet={isTablet} isDesktop={isDesktop}>
                    <Button
                      label={isMobile ? "Cozinha" : "👨‍🍳 Cozinha"}
                      variant="primary"
                      onPress={() => router.push("/(private)/kitchen")}
                    />
                  </ButtonWrapper>
                )}
                {canAccessReports && (
                  <ButtonWrapper isTablet={isTablet} isDesktop={isDesktop}>
                    <Button
                      label={isMobile ? "Relatórios" : "📈 Relatórios"}
                      variant="danger"
                      onPress={() => router.push("/(private)/report")}
                    />
                  </ButtonWrapper>
                )}
                <ButtonWrapper isTablet={isTablet} isDesktop={isDesktop}>
                  <Button
                  variant="third"
                    label={isMobile ? "Planos" : "💳 Planos"}
                    onPress={() => router.push("/plans")}
                  />
                </ButtonWrapper>
                <ButtonWrapper isTablet={isTablet} isDesktop={isDesktop}>
                    <Button
                    variant="secondary"
                      label={isMobile ? "Histórico de Faturas" : "🍀 Histórico de Faturas"}
                      onPress={handleOpenBillingPortal}
                    />
                </ButtonWrapper>
              </MenuColumn>
            </MenuSection>

            {canViewAdvancedCharts && selectedRestaurant && (
              <StatusSection
                isMobile={isMobile}
                isTablet={isTablet}
                isDesktop={isDesktop}
              >
                <StatusItem>
                  <StatusLabel isMobile={isMobile}>Vendas Hoje</StatusLabel>
                  <StatusValue isMobile={isMobile}>{totalSales}</StatusValue>
                </StatusItem>
                <StatusItem>
                  <StatusLabel isMobile={isMobile}>Produtos</StatusLabel>
                  <StatusValue isMobile={isMobile}>{totalProducts}</StatusValue>
                </StatusItem>
                {(isTablet || isDesktop) && (
                  <StatusItem>
                    <StatusLabel isMobile={isMobile}>Restaurante</StatusLabel>
                    <StatusValue isMobile={isMobile}>
                      {selectedRestaurant.name.substring(0, 12)}
                      {selectedRestaurant.name.length > 12 ? "..." : ""}
                    </StatusValue>
                  </StatusItem>
                )}
              </StatusSection>
            )}
          </GridItem>
        </GridContainer>
      </ScrollContent>
    </Container>
  );
}
