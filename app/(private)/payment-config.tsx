import React, { useEffect, useState, useCallback } from "react";
import { Alert, FlatList } from "react-native";
import styled from "styled-components/native";
import { Picker } from "@react-native-picker/picker";
import {
  getPaymentConfigs,
  createOrUpdatePaymentConfig,
  deletePaymentConfig,
  PaymentMethod,
  PaymentMethodLabels,
  PaymentConfig,
  CardBrand,
  CardBrandLabels,
} from "@/services/payment";
import useRestaurant from "@/hooks/useRestaurant";
import { Stack } from "expo-router";

const Container = styled.ScrollView`
  flex: 1;
  background-color: #041224;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #ffffff;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: #ffffff;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  color: #666;
`;

const PickerContainer = styled.View`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  height: 40px;
  justify-content: center;
`;

const StyledPicker = styled(Picker)`
  color: #666;
  background-color: transparent;
  height: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.TouchableOpacity<{ variant?: "primary" | "secondary" }>`
  background-color: ${(props: { variant: string; }) =>
    props.variant === "secondary" ? "white" : "#0099aa"};
  border: 1px solid #0099aa;
  padding: 12px;
  border-radius: 8px;
  flex: 1;
  margin: 0 5px;
`;

const ButtonText = styled.Text<{ variant?: "primary" | "secondary" }>`
  color: ${(props: { variant: string; }) => (props.variant === "secondary" ? "#0099aa" : "white")};
  font-weight: 600;
  text-align: center;
`;

const TaxItem = styled.View`
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function TaxPage() {
  const { selectedRestaurant } = useRestaurant();
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [brand, setBrand] = useState<CardBrand | "">("");
  const [feePercent, setFeePercent] = useState("");
  const [configs, setConfigs] = useState<PaymentConfig[]>([]);

  const loadConfigs = useCallback(async () => {
    try {
      if (!selectedRestaurant?.id) {
        console.log("Nenhum restaurante selecionado");
        return;
      }
      const data = await getPaymentConfigs(selectedRestaurant.id);
      setConfigs(data);
    } catch (err: any) {
      console.error("Erro ao carregar configurações:", err);
      Alert.alert("Erro", err.message);
    }
  }, [selectedRestaurant?.id]);

  async function handleAdd() {
    console.log("handleAdd chamado", { method, brand, feePercent, restaurantId: selectedRestaurant?.id });

    // Validação melhorada
    if (!method || !feePercent || !brand) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      console.log("Campos faltando:", { method, brand, feePercent });
      return;
    }

    // Validação do restaurante
    if (!selectedRestaurant?.id) {
      Alert.alert("Erro", "Nenhum restaurante selecionado!");
      return;
    }

    // Validação do número
    const fee = parseFloat(feePercent);
    if (isNaN(fee) || fee < 0) {
      Alert.alert("Erro", "Taxa deve ser um número válido!");
      return;
    }

    try {
      console.log("Tentando criar/atualizar configuração...");
      
      await createOrUpdatePaymentConfig(selectedRestaurant.id, {
        method: method as PaymentMethod,
        brand: brand as CardBrand,
        feePercent: fee,
      });
      
      console.log("Configuração salva com sucesso!");
      
      // Reset dos campos
      setFeePercent("");
      setMethod("");
      setBrand("");
      
      // Recarregar a lista
      await loadConfigs();
      
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      Alert.alert("Erro", err.message);
    }
  }

  async function handleDelete(item: PaymentConfig) {
    try {
      if (!selectedRestaurant?.id) {
        Alert.alert("Erro", "Nenhum restaurante selecionado!");
        return;
      }
      await deletePaymentConfig(selectedRestaurant.id, item.id);
      loadConfigs();
    } catch (err: any) {
      console.error("Erro ao deletar:", err);
      Alert.alert("Erro", err.message);
    }
  }

  useEffect(() => {
    console.log("Restaurante selecionado:", selectedRestaurant?.id);
    loadConfigs();
  }, [loadConfigs, selectedRestaurant?.id]);

  return (
    <>
      <Stack.Screen options={{title: "Gestão de Taxas", }} />
      <Container>
        <Subtitle>Cadastre e gerencie as taxas dos cartões</Subtitle>

        {/* Tipo de Cartão */}
        <Label>Tipo de Cartão</Label>
        <PickerContainer>
          <StyledPicker
            selectedValue={method}
            onValueChange={(value: string) => setMethod(value as PaymentMethod)}
            dropdownIconColor="#ffffff"
          >
            <Picker.Item 
              label="Selecione o tipo" 
              value="" 
              color="#a0aec0"
              style={{ fontSize: 14 }}
            />
            {Object.entries(PaymentMethodLabels).map(([key, label]) => (
              <Picker.Item 
                key={key} 
                label={label} 
                value={key} 
                color="#000"
                style={{ fontSize: 14 }}
              />
            ))}
          </StyledPicker>
        </PickerContainer>

        {/* Bandeira */}
        <Label>Bandeira do Cartão</Label>
        <PickerContainer>
          <StyledPicker
            selectedValue={brand}
            onValueChange={(value: string) => setBrand(value as CardBrand)}
            dropdownIconColor="#ffffff"
          >
            <Picker.Item 
              label="Selecione a bandeira" 
              value="" 
              color="#a0aec0"
              style={{ fontSize: 14 }}
            />
            {Object.entries(CardBrandLabels).map(([key, label]) => (
              <Picker.Item 
                key={key} 
                label={label} 
                value={key} 
                color="#000"
                style={{ fontSize: 14 }}
              />
            ))}
          </StyledPicker>
        </PickerContainer>

        {/* Taxa */}
        <Label>Taxa (%)</Label>
        <Input
          keyboardType="numeric"
          placeholder="Ex: 2.5"
          value={feePercent}
          onChangeText={setFeePercent}
        />

        {/* Botões */}
        <Row>
          <Button variant="secondary" onPress={() => {
            setFeePercent("");
            setMethod("");
            setBrand("");
          }}>
            <ButtonText variant="secondary">Limpar</ButtonText>
          </Button>
          <Button onPress={handleAdd}>
            <ButtonText>Adicionar Taxa</ButtonText>
          </Button>
        </Row>

        {/* Lista */}
        <Title style={{ marginTop: 30 }}>Taxas Cadastradas</Title>
        {configs.length === 0 ? (
          <Subtitle>Nenhuma taxa cadastrada ainda.</Subtitle>
        ) : (
          <FlatList
            data={configs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaxItem>
                <Subtitle>
                  {item.method ? PaymentMethodLabels[item.method] : "Sem tipo"} -{" "}
                  {item.brand ? CardBrandLabels[item.brand] : "Sem bandeira"} - {item.feePercent}%
                </Subtitle>
                <Button variant="secondary" onPress={() => handleDelete(item)}>
                  <ButtonText variant="secondary">Excluir</ButtonText>
                </Button>
              </TaxItem>
            )}
          />
        )}
      </Container>
    </>
  );
}