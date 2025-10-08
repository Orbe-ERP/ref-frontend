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
import { Ionicons } from "@expo/vector-icons";

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
  color: #fff;
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

const DeleteButton = styled.TouchableOpacity`
  padding: 6px;
  justify-content: center;
  align-items: center;
`;

const TaxItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  /* border: 1px solid #eee; */
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 6px;
`;

const TaxText = styled.Text`
  color: #fff;
  font-size: 14px;
  margin: 0;
  flex-shrink: 1;
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
        return;
      }
      const data = await getPaymentConfigs(selectedRestaurant.id);
      setConfigs(data);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }, [selectedRestaurant?.id]);

  async function handleAdd() {
    if (!method || !feePercent || !brand) {
      Alert.alert("Atenção", "Preencha todos os campos!");
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
      await createOrUpdatePaymentConfig(selectedRestaurant.id, {
        method: method as PaymentMethod,
        brand: brand as CardBrand,
        feePercent: fee,
      });
      
      // Reset dos campos
      setFeePercent("");
      setMethod("");
      setBrand("");
      
      // Recarregar a lista
      await loadConfigs();
      
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  async function handleDelete(item: PaymentConfig) {
    try {
      if (!selectedRestaurant?.id) {
        Alert.alert("Erro", "Nenhum restaurante selecionado!");
        return;
      }
      await deletePaymentConfig(selectedRestaurant.id, item.method, item.brand);
      await loadConfigs();
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  useEffect(() => {
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
          style={{ color: "#a0aec0" }}
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
                <TaxText>
                  {item.method ? PaymentMethodLabels[item.method] : "Sem tipo"} -{" "}
                  {item.brand ? CardBrandLabels[item.brand] : "Sem bandeira"} - {item.feePercent}%
                </TaxText>
                <DeleteButton onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </DeleteButton>
              </TaxItem>
            )}
          />
        )}
      </Container>
    </>
  );
}