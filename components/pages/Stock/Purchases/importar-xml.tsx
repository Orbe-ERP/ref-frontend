import { useState } from "react";
import { Platform, View, Text, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import styled from "styled-components/native";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { importPurchaseXml } from "@/services/purchase";
import useRestaurant from "@/hooks/useRestaurant";

const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.Text`
  font-size: 14px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.feedback.info};
`;

const Card = styled.View`
  padding: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  margin-top: 16px;
`;

const InfoText = styled.Text`
  margin-top: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.feedback.info};
`;

export default function ImportXmlScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const { selectedRestaurant } = useRestaurant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useAppTheme();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xml")) {
      setError("Selecione um arquivo XML válido.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await importPurchaseXml({
        file,
        restaurantId: selectedRestaurant?.id || "",
      });

      const previewPayload = {
        restaurantId: selectedRestaurant?.id || "",
        invoiceKey: data.invoiceKey,
        supplierName: data.supplier?.name,
        date: data.issuedAt,
        items: data.items.map((item: any) => ({
          stockItemId: "",
          name: item.originalName,
          quantity: item.quantity,
          unitCost: item.unitCost,
        })),
      };

      router.push({
        pathname: "/stock/purchases/import-preview",
        params: { payload: JSON.stringify(previewPayload) },
      });
    } catch (err) {
      setError("Não foi possível importar o XML.");
    } finally {
      setLoading(false);
    }
  };

  if (!isWeb) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Upload de XML",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text.primary,
          }}
        />
        <Container>
          <Title>Importação de XML</Title>
          <Description>
            Esta funcionalidade está disponível apenas na versão web.
          </Description>

          <Card>
            <Text>
              Para importar notas fiscais em XML, utilize o sistema pelo
              navegador.
            </Text>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Upload de XML",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <Container>
        <Title>Importar XML</Title>
        <Description>
          Importe uma nota fiscal em XML para gerar uma compra automaticamente.
        </Description>

        <Card>
          <input
            type="file"
            accept=".xml"
            onChange={handleFileSelect}
            disabled={loading}
            style={{
              fontSize: 14,
            }}
          />

          {loading && (
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator />
            </View>
          )}

          {error && <ErrorText>{error}</ErrorText>}

          <InfoText>
            • Apenas arquivos XML
            {"\n"}• Os dados serão validados antes da confirmação
          </InfoText>
        </Card>
      </Container>
    </>
  );
}
