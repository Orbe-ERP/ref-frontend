import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import useRestaurant from "@/hooks/useRestaurant";
import { HorizontalBarChart } from "@/components/organisms/TopProductsChart/components/HorizontalBarChart";
import { usePermissions } from "@/hooks/usePermissions";
import { SalesService } from "@/services/salesService";
import { getOrdersByRestaurant } from "@/services/order";
import { ProductSales } from "@/services/types";
import Button from "@/components/atoms/Button";
import { Ionicons } from "@expo/vector-icons";
import LogoutButton from "@/components/atoms/LogoutButton";
import { ThemeToggle } from "@/components/molecules/ToggleTheme";
import styled from "styled-components/native";
import { useAppTheme } from "@/context/ThemeProvider/theme";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollContent = styled(ScrollView).attrs({
  contentContainerStyle: {
    padding: 16,
    paddingBottom: 40,
    minHeight: "100%",
  },
})``;

const LogoutContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ChartSection = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.1);
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SalesCount = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RefreshButton = styled.TouchableOpacity`
  padding: 6px;
`;

const EmptyState = styled.View`
  padding: 24px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.border};
`;

const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.text.accent};
  text-align: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
`;

const StatusSection = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 16px;
  flex-direction: row;
  justify-content: space-around;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const StatusItem = styled.View`
  align-items: center;
`;

const StatusLabel = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
  font-weight: 500;
`;

const StatusValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionsRow = styled.View`
  flex-direction: row;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const MenuSection = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 16px;
  border-width: 1;
  border-color: rgba(255, 255, 255, 0.08);
`;

const MenuColumn = styled.View`
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;

export default function IndexScreen() {
  const [salesData, setSalesData] = useState<ProductSales[]>([]);
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
      const salesData = SalesService.getSalesByTimeRange(orders);
      setSalesData(salesData.day);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados de vendas");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (selectedRestaurant?.id) loadSalesData();
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Início",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: { color: theme.colors.text.primary },
        }}
      />
      <ScrollContent showsVerticalScrollIndicator={false}>
        <LogoutContainer>
          <ThemeToggle />
          <LogoutButton />
        </LogoutContainer>

        {canViewAdvancedCharts && (
          <ChartSection>
            <SectionHeader>
              <SectionTitle>📊 Pratos Mais Vendidos Hoje</SectionTitle>
              <ActionsRow>
                {selectedRestaurant && (
                  <SalesCount>
                    {salesData.length}{" "}
                    {salesData.length === 1 ? "produto" : "produtos"} diferentes
                    vendidos
                  </SalesCount>
                )}
                <RefreshButton onPress={refreshData} disabled={loading}>
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={theme.colors.accent}
                  />
                </RefreshButton>
              </ActionsRow>
            </SectionHeader>

            {!selectedRestaurant ? (
              <EmptyState>
                <EmptyText>
                  Selecione um restaurante para ver as vendas
                </EmptyText>
                <Button
                  label="🍴 Selecionar Restaurante"
                  onPress={() => router.push("/(private)/select-restaurant")}
                />
              </EmptyState>
            ) : loading ? (
              <EmptyText>Carregando vendas...</EmptyText>
            ) : error ? (
              <EmptyText>{error}</EmptyText>
            ) : (
              <>
                <HorizontalBarChart data={salesData} />

                {canAccessDashboard && (
                  <ActionsRow>
                    <Button
                      label="📊 Dashboard Completo"
                      onPress={() => router.push("/(private)/dashboard")}
                    />
                  </ActionsRow>
                )}
              </>
            )}
          </ChartSection>
        )}

        <MenuSection>
          <MenuColumn>
            {canAccessKitchen && (
              <Button
                label="Cozinha"
                variant="primary"
                onPress={() => router.push("/(private)/kitchen")}
              />
            )}
            {canAccessReports && (
              <Button
                label="Relatórios"
                variant="danger"
                onPress={() => router.push("/(private)/report")}
              />
            )}

            <Button label=" Planos" onPress={() => router.push("/plans")} />
          </MenuColumn>
        </MenuSection>

        {canViewAdvancedCharts && selectedRestaurant && (
          <StatusSection>
            <StatusItem>
              <StatusLabel>Vendas Hoje</StatusLabel>
              <StatusValue>
                {salesData.reduce((sum, item) => sum + item.salesCount, 0)}
              </StatusValue>
            </StatusItem>
            <StatusItem>
              <StatusLabel>Produtos</StatusLabel>
              <StatusValue>{salesData.length}</StatusValue>
            </StatusItem>
          </StatusSection>
        )}
      </ScrollContent>
    </Container>
  );
}
