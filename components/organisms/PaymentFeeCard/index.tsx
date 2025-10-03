import React from "react";
import Card from "../../atoms/Card";
import PaymentFeeForm from "../../molecules/PaymentFeeForm";

interface PaymentFeeCardProps {
  method: "CREDIT_CARD" | "DEBIT_CARD";
  onSuccess: () => void;
}

export default function PaymentFeeCard({ method, onSuccess }: PaymentFeeCardProps) {
  return (
    <Card style={{ marginBottom: 16 }}>
      <PaymentFeeForm method={method} onSuccess={onSuccess} />
    </Card>
  );
}
