import React from "react";
import { Modal, View } from "react-native";
import Card from "@/components/atoms/Card";
import Title from "@/components/atoms/Title";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";

interface ConfirmActionModalProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export default function ConfirmActionModal({
  visible,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "primary",
}: ConfirmActionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Card>
          <Title style={{ marginBottom: 8 }}>{title}</Title>

          {description && (
            <Text color="#6B7280">
              {description}
            </Text>
          )}

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              hasFlex1
              label={cancelLabel}
              variant="secondary"
              onPress={onCancel}
            />
            <Button
              hasFlex1
              label={confirmLabel}
              variant={variant}
              onPress={onConfirm}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}
