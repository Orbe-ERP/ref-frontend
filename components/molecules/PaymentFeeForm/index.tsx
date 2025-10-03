import React, { useState } from "react";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import { Text } from "../../atoms/Text";
import { Container, Row } from "./styles";
import { CreateOrUpdatePaymentConfig, createOrUpdatePaymentConfig } from "@/services/payment";
import useRestaurant from "@/hooks/useRestaurant";

interface PaymentFeeFormProps {
  method: "CREDIT_CARD" | "DEBIT_CARD";
  onSuccess: () => void;
}

export default function PaymentFeeForm({ method, onSuccess }: PaymentFeeFormProps) {
  const { selectedRestaurant } = useRestaurant();
  const [feePercent, setFeePercent] = useState("");
  const [feeFixed, setFeeFixed] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!feePercent) return;
    try {
      setLoading(true);
      const body: CreateOrUpdatePaymentConfig = {
        method,
        feePercent: parseFloat(feePercent),
        feeFixed: feeFixed ? parseFloat(feeFixed) : undefined,
      };

      await createOrUpdatePaymentConfig(selectedRestaurant?.id, body);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Text size={24} weight="bold">
        {method === "CREDIT_CARD" ? "Cartão de Crédito" : "Cartão de Débito"}
      </Text>

      <Row>
        <Input
          keyboardType="numeric"
          placeholder="Taxa Percentual (%)"
          value={feePercent}
          onChangeText={setFeePercent}
        />
      </Row>

      <Row>
        <Input
          keyboardType="numeric"
          placeholder="Taxa Fixa (R$)"
          value={feeFixed}
          onChangeText={setFeeFixed}
        />
      </Row>

      <Button
        label={loading ? "Salvando..." : "Salvar"}
        onPress={handleSubmit}
        variant="primary"
      />
    </Container>
  );
}
