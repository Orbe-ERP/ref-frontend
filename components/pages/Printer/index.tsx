import { FlatList, Switch, ScrollView } from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { usePrinters } from "@/hooks/usePrinters";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { ToastNotice } from "@/components/molecules/ToastNotice";
import * as S from "./styles";
import { Picker } from "@react-native-picker/picker";
import * as Clipboard from "expo-clipboard";
import Input from "@/components/atoms/Input";
import CustomSwitch from "@/components/atoms/CustomSwitch";

export default function PrinterListScreen() {
  const theme = useAppTheme();
  const { isTablet, isDesktop, isWeb } = useResponsive();

  const {
    printers,
    loading,
    createPrinter,
    updatePrinter,
    deletePrinter: removePrinter,
    regenerateAgent,
  } = usePrinters();

  const [editingPrinter, setEditingPrinter] = useState<any | null>(null);
  const [isDefault, setIsDefault] = useState(false);
  const [printerName, setPrinterName] = useState("");
  const [visibleAgentKey, setVisibleAgentKey] = useState<string | null>(null);

  const [printerType, setPrinterType] = useState<
    "RECEIPT" | "KITCHEN" | "BAR" | "OTHER"
  >("RECEIPT");

  const [isActive, setIsActive] = useState(true);

  function resetForm() {
    setEditingPrinter(null);
    setIsDefault(false);
    setPrinterName("");
    setPrinterType("RECEIPT");
    setIsActive(true);
  }

  function handleEdit(printer: any) {
    setEditingPrinter(printer);

    setIsDefault(!!printer.default || !!printer.isDefault);
    setPrinterName(printer.name || "Computador de Impressão");
    setPrinterType(printer.type || "RECEIPT");
    setIsActive(printer.active ?? true);
  }

  async function handleSave() {
    if (!printerName) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const data: any = {
      name: printerName,
      default: isDefault,
      type: printerType,
    };

    if (editingPrinter) {
      data.active = isActive;
    }

    try {
      if (editingPrinter) {
        await updatePrinter(editingPrinter.id, data);
        Toast.show({
          type: "success",
          text1: "Agente atualizado",
          text2: "Configuração salva com sucesso",
        });
      } else {
        const created = await createPrinter({
          ...data,
          restaurantId: printers[0]?.restaurantId,
        });

        setVisibleAgentKey(created.agentKey);

        Toast.show({
          type: "success",
          text1: "Agente adicionado",
          text2: "Agent Key gerada com sucesso",
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
    try {
      await removePrinter(printer.id);
      Toast.show({
        type: "success",
        text1: "Agente excluído",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir",
      });
    }
  }

  async function handleRegenerateKey(printer: any) {
    try {
      const res = await regenerateAgent(printer.id);

      setVisibleAgentKey(res.agentKey);

      Toast.show({
        type: "success",
        text1: "Agent Key regenerada",
        text2: "Copie o novo Agent Key.",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao regenerar",
      });
    }
  }

  async function copyAgentKey() {
    if (!visibleAgentKey) return;

    await Clipboard.setStringAsync(visibleAgentKey);
    setVisibleAgentKey(null);

    Toast.show({
      type: "success",
      text1: "Copiado!",
      text2: "Agent Key copiada para a área de transferência.",
    });
  }

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
              message="Configure o computador onde as impressoras estão conectadas."
              iconColor={theme.theme.colors.feedback.info}
              titleColor={theme.theme.colors.feedback.info}
              messageColor={theme.theme.colors.text.secondary}
              backgroundColor={theme.theme.colors.feedback.info + "10"}
              isTablet={isTablet}
              isDesktop={isDesktop}
            />

            <S.FormCard isTablet={isTablet} isDesktop={isDesktop}>
              <S.FormTitle>
                {editingPrinter ? "Editar Agente" : "Novo Agente"}
              </S.FormTitle>

              <S.Label>Nome do Agente*</S.Label>
              <S.Field>
                <Input
                  value={printerName}
                  onChangeText={setPrinterName}
                  placeholder="Ex: Caixa Principal, Balcão, Cozinha"
                  returnKeyType="next"
                />
              </S.Field>
              <S.Label>Tipo do Agente*</S.Label>
              <S.PickerContainer>
                <S.StyledPicker
                  selectedValue={printerType}
                  onValueChange={(value) => setPrinterType(value)}
                  style={{ color: theme.theme.colors.text.primary }}
                  dropdownIconColor={theme.theme.colors.primary}
                >
                  <Picker.Item
                    label="Recibo"
                    value="RECEIPT"
                    color={theme.theme.colors.primary}
                  />
                  <Picker.Item
                    label="Cozinha"
                    value="KITCHEN"
                    color={theme.theme.colors.primary}
                  />
                  <Picker.Item
                    label="Bar"
                    value="BAR"
                    color={theme.theme.colors.primary}
                  />
                  <Picker.Item
                    label="Outro"
                    value="OTHER"
                    color={theme.theme.colors.primary}
                  />
                </S.StyledPicker>
              </S.PickerContainer>

              {editingPrinter && (
                <S.SwitchRow>
                  <S.Label>Ativo</S.Label>

                  <CustomSwitch
                    value={isActive}
                    onValueChange={setIsActive}
                  />
                </S.SwitchRow>
              )}

              <S.SwitchRow>
                <S.Label>Agente padrão</S.Label>
                <CustomSwitch
                  value={isDefault}
                  onValueChange={setIsDefault}
                />
              </S.SwitchRow>

              <S.HelpText style={{ marginTop: -8 }}>
                {isDefault
                  ? "Este agente será usado como padrão para novas impressoras"
                  : "Marque se este é o agente principal de impressão"}
              </S.HelpText>

              <S.Actions>
                <Button label="Cancelar" onPress={resetForm} />
                <Button
                  label={
                    editingPrinter ? "Salvar alterações" : "Adicionar agente"
                  }
                  onPress={handleSave}
                />
              </S.Actions>
            </S.FormCard>

            {visibleAgentKey && (
              <S.Card isTablet={isTablet} isDesktop={isDesktop}>
                <S.InfoContainer>
                  <S.Name>Nova Chave</S.Name>
                  <S.Info>{visibleAgentKey}</S.Info>
                  <S.Info>• Essa chave será usada para autenticação do agente de impressão.</S.Info>
                </S.InfoContainer>

                      <S.ActionsRow>

                      <S.ActionButtonWrapper>
                          <Button
                          variant="danger"
                            label="Copiar"
                            onPress={copyAgentKey}
                          />
                        </S.ActionButtonWrapper>
                                              </S.ActionsRow>


              </S.Card>
            )}

            {printers.length > 0 && (
              <>
                <S.SectionTitle>
                  Agentes cadastrados ({printers.length})
                </S.SectionTitle>

                <FlatList
                  data={printers}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    paddingBottom: 120,
                  }}
                  renderItem={({ item }) => (
                    <S.Card
                      isTablet={isTablet}
                      isDesktop={isDesktop}
                      key={item.id}
                    >
                      <S.InfoContainer>
                        <S.Name>
                          {item.name}
                          {item.isDefault && (
                            <S.DefaultBadge> Padrão</S.DefaultBadge>
                          )}
                        </S.Name>

                        <S.Info>
                          Tipo: {String(item.type)} • Status:{" "}
                          {item.active ? "Ativo" : "Inativo"}
                        </S.Info>
                      </S.InfoContainer>

                      <S.ActionsRow>
                        <S.ActionButtonWrapper>
                          <Button
                            label="Editar"
                            onPress={() => handleEdit(item)}
                          />
                        </S.ActionButtonWrapper>

                        <S.ActionButtonWrapper>
                          <Button
                            variant="secondary"
                            label="Nova Chave"
                            onPress={() => handleRegenerateKey(item)}
                          />
                        </S.ActionButtonWrapper>

                        <S.ActionButtonWrapper>
                          <Button
                            variant="danger"
                            label="Excluir"
                            onPress={() => handleDelete(item)}
                          />
                        </S.ActionButtonWrapper>
                      </S.ActionsRow>
                    </S.Card>
                  )}
                />
              </>
            )}
          </S.ContentWrapper>
        </S.Container>
      </ScrollView>
    </>
  );
}
