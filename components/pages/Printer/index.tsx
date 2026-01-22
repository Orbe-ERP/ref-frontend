import { FlatList, Switch, ScrollView } from "react-native"; // Adicione ScrollView aqui
import { useState } from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { usePrinters } from "@/hooks/usePrinters";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { ToastNotice } from "@/components/molecules/ToastNotice";
import * as S from "./styles";

export default function PrinterListScreen() {
  const theme = useAppTheme();
  const { isTablet, isDesktop, isWeb } = useResponsive();

  const {
    printers,
    loading,
    createPrinter,
    updatePrinter,
    deletePrinter: removePrinter,
  } = usePrinters();

  const [editingPrinter, setEditingPrinter] = useState<any | null>(null);
  const [computerIp, setComputerIp] = useState("");
  const [port, setPort] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [printerName, setPrinterName] = useState("");
  const [showIpHelp, setShowIpHelp] = useState(false); // Estado para mostrar ajuda

  function resetForm() {
    setEditingPrinter(null);
    setComputerIp("");
    setPort("");
    setIsDefault(false);
    setPrinterName("");
    setShowIpHelp(false);
  }

  function handleEdit(printer: any) {
    setEditingPrinter(printer);
    setComputerIp(printer.computerIp || printer.ip);
    setPort(String(printer.port));
    setIsDefault(!!printer.default);
    setPrinterName(printer.name || "Computador de Impressão");
  }

  async function handleSave() {
    if (!computerIp || !port || !printerName) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const data = {
      name: printerName,
      computerIp,
      port: Number(port),
      default: isDefault,
      ip: computerIp, // Mantém compatibilidade
    };

    try {
      if (editingPrinter) {
        await updatePrinter(editingPrinter.id, data);
        Toast.show({ 
          type: "success", 
          text1: "✓ Computador atualizado",
          text2: "Configuração salva com sucesso"
        });
      } else {
        await createPrinter({
          ...data,
          restaurantId: printers[0]?.restaurantId,
        });
        Toast.show({ 
          type: "success", 
          text1: "✓ Computador adicionado",
          text2: "Agora você pode configurar as impressoras"
        });
      }

      resetForm();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar",
        text2: "Verifique a conexão e tente novamente",
      });
    }
  }

  async function handleDelete(printer: any) {
    if (printer.default) {
      Toast.show({
        type: "error",
        text1: "Ação não permitida",
        text2: "Não é possível excluir o computador padrão",
      });
      return;
    }

    try {
      await removePrinter(printer.id);
      Toast.show({
        type: "success",
        text1: "Computador excluído",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir",
      });
    }
  }

  // Função para mostrar modal de ajuda
  const handleIpHelp = () => {
    setShowIpHelp(true);
    Toast.show({
      type: "info",
      text1: "Como descobrir o IP do computador",
      text2: "Veja as instruções abaixo do campo",
      visibilityTime: 3000,
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Configurações de Impressão",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
          },
        }}
      />

      <ScrollView 
        style={{ flex: 1, backgroundColor: theme.theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <S.Container isWeb={isWeb} isTablet={isTablet} isDesktop={isDesktop}>
          <S.ContentWrapper isTablet={isTablet} isDesktop={isDesktop}>
            <ToastNotice
              title="Configuração de Impressão"
              message="Configure o computador onde as impressoras estão conectadas. Cada computador pode ter múltiplas impressoras instaladas."
              iconColor={theme.theme.colors.feedback.info}
              titleColor={theme.theme.colors.feedback.info}
              messageColor={theme.theme.colors.text.secondary}
              backgroundColor={theme.theme.colors.feedback.info + "10"}
              isTablet={isTablet}
              isDesktop={isDesktop}
            />

            {/* Formulário */}
            <S.FormCard isTablet={isTablet} isDesktop={isDesktop}>
              <S.FormTitle>
                {editingPrinter ? "Editar computador" : "Novo computador"}
              </S.FormTitle>

              <S.Field>
                <S.Label>Nome do computador *</S.Label>
                <S.Input
                  value={printerName}
                  onChangeText={setPrinterName}
                  placeholder="Ex: Caixa Principal, Balcão, Cozinha"
                  returnKeyType="next"
                />
              </S.Field>

              <S.Field>
                <S.Label>IP do computador *</S.Label>
                <S.Input
                  value={computerIp}
                  onChangeText={setComputerIp}
                  placeholder="Ex: 192.168.1.100"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                />
                <S.HelpButton onPress={handleIpHelp}>
                  <S.HelpButtonText>Como descobrir meu IP?</S.HelpButtonText>
                </S.HelpButton>
                
                {/* Instruções detalhadas para descobrir o IP */}
                {showIpHelp && (
                  <S.IpInstructions>
                    <S.InstructionsTitle>📱 Como descobrir o IP:</S.InstructionsTitle>
                    
                    <S.InstructionItem>
                      <S.InstructionBullet>1.</S.InstructionBullet>
                      <S.InstructionText>
                        <S.InstructionHighlight>Windows: </S.InstructionHighlight>
                        Pressione{" "}
                        <S.InstructionCode>Win + R</S.InstructionCode>
                        , digite{" "}
                        <S.InstructionCode>cmd</S.InstructionCode>
                        , pressione Enter, digite{" "}
                        <S.InstructionCode>ipconfig</S.InstructionCode>
                        , procure por &quot;IPv4&quot;
                      </S.InstructionText>
                    </S.InstructionItem>

                    <S.InstructionItem>
                      <S.InstructionBullet>2.</S.InstructionBullet>
                      <S.InstructionText>
                        <S.InstructionHighlight>Mac: </S.InstructionHighlight>
                        Vá em{" "}
                        <S.InstructionCode>Preferências do Sistema → Rede</S.InstructionCode>
                        , selecione sua conexão e veja o IP
                      </S.InstructionText>
                    </S.InstructionItem>

                    <S.InstructionItem>
                      <S.InstructionBullet>3.</S.InstructionBullet>
                      <S.InstructionText>
                        <S.InstructionHighlight>Linux: </S.InstructionHighlight>
                        Abra o terminal e digite{" "}
                        <S.InstructionCode>hostname -I</S.InstructionCode>
                      </S.InstructionText>
                    </S.InstructionItem>

                    <S.InstructionItem>
                      <S.InstructionBullet>4.</S.InstructionBullet>
                      <S.InstructionText>
                        <S.InstructionHighlight>Dica: </S.InstructionHighlight>
                        Geralmente começa com{" "}
                        <S.InstructionCode>192.168.</S.InstructionCode>
                        , <S.InstructionCode>10.0.</S.InstructionCode>
                        {" "}ou{" "}
                        <S.InstructionCode>172.16.</S.InstructionCode>
                      </S.InstructionText>
                    </S.InstructionItem>

                    <S.CloseHelpButton onPress={() => setShowIpHelp(false)}>
                      <S.CloseHelpText>Entendi, fechar</S.CloseHelpText>
                    </S.CloseHelpButton>
                  </S.IpInstructions>
                )}
              </S.Field>

              <S.Field>
                <S.Label>Porta *</S.Label>
                <S.Input
                  value={port}
                  onChangeText={setPort}
                  keyboardType="numeric"
                  placeholder="9100"
                  returnKeyType="done"
                />
                <S.HelpText>
                  Porta padrão para impressoras de rede
                </S.HelpText>
              </S.Field>

              <S.SwitchRow>
                <S.Label>Computador padrão</S.Label>
                <Switch 
                  value={isDefault} 
                  onValueChange={setIsDefault}
                  trackColor={{ 
                    false: theme.theme.colors.border + "80",
                    true: theme.theme.colors.primary 
                  }}
                  thumbColor={isDefault 
                    ? theme.theme.colors.surface
                    : theme.theme.colors.text.secondary
                  }
                  ios_backgroundColor={theme.theme.colors.border}
                />
              </S.SwitchRow>

              <S.HelpText style={{ marginTop: -8, marginBottom: 16 }}>
                {isDefault 
                  ? "Este computador será usado como padrão para novas impressoras"
                  : "Marque se este é o computador principal de impressão"}
              </S.HelpText>

              <S.Actions>
                <Button 
                  label="Cancelar" 
                  onPress={resetForm}
                />
                <Button
                  label={editingPrinter ? "Salvar alterações" : "Adicionar computador"}
                  onPress={handleSave}
                />
              </S.Actions>
            </S.FormCard>

            {/* Lista de computadores cadastrados */}
            {printers.length > 0 && (
              <>
                <S.SectionTitle>
                  Computadores cadastrados ({printers.length})
                </S.SectionTitle>

                <FlatList
                  data={printers}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false} // Desabilita scroll interno pois já tem ScrollView
                  contentContainerStyle={{
                    paddingBottom: 120,
                  }}
                  renderItem={({ item }) => (
                    <S.Card isTablet={isTablet} isDesktop={isDesktop} key={item.id}>
                      <S.InfoContainer>
                        <S.Name>
                          {item.name}
                          {item.default && (
                            <S.DefaultBadge> Padrão</S.DefaultBadge>
                          )}
                        </S.Name>
                        <S.Info>
                          IP: {item.computerIp || item.ip}:{item.port}
                        </S.Info>
                        <S.Status>
                          <Ionicons 
                            name="hardware-chip-outline" 
                            size={14} 
                            color={theme.theme.colors.text.secondary} 
                          />
                          <S.StatusText>Computador com impressora</S.StatusText>
                        </S.Status>
                      </S.InfoContainer>

                      <S.ActionsRow>
                        <Button 
                          label="Editar" 
                          onPress={() => handleEdit(item)}
                        />

                        {!item.default && (
                          <Button
                            variant="danger"
                            label="Excluir"
                            onPress={() => handleDelete(item)}
                          />
                        )}
                      </S.ActionsRow>
                    </S.Card>
                  )}
                />
              </>
            )}

            {/* Estado vazio */}
            {!loading && printers.length === 0 && (
              <S.EmptyState>
                <Ionicons 
                  name="desktop-outline" 
                  size={64} 
                  color={theme.theme.colors.text.secondary + "60"} 
                />
                <S.EmptyText>
                  Nenhum computador configurado
                </S.EmptyText>
                <S.EmptySubtext>
                  Adicione o computador onde as impressoras estão conectadas
                </S.EmptySubtext>
                <Button
                  label="Adicionar primeiro computador"
                  onPress={() => {}}
                  icon={<Ionicons name="add-circle-outline" size={20} />}
                />
              </S.EmptyState>
            )}

            {/* Toast com instruções */}
            <ToastNotice
              title="Como funciona a impressão?"
              message={`1. Configure o computador onde a impressora está conectada
2. Instale o driver da impressora nesse computador
3. Compartilhe a impressora na rede
4. Adicione o IP deste computador no sistema`
              }
              iconName="information-circle-outline"
              iconColor={theme.theme.colors.feedback.info}
              titleColor={theme.theme.colors.feedback.info}
              messageColor={theme.theme.colors.text.secondary}
              backgroundColor={theme.theme.colors.feedback.info + "10"}
              isTablet={isTablet}
              isDesktop={isDesktop}
            />
            <S.Spacer />
          </S.ContentWrapper>
        </S.Container>
      </ScrollView>
    </>
  );
}