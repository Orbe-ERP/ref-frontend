import React from "react";
import { Modal } from "react-native";
import Input from "@/components/atoms/Input";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Actions,
  ActionButton,
  ActionText,
} from "./styles";

interface ExpertModalProps {
  visible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  showDelete?: boolean;
  onDelete?: () => void;
  inputPlaceholder: string;
}

const ExpertModal: React.FC<ExpertModalProps> = ({
  visible,
  title,
  value,
  inputPlaceholder,
  onChangeText,
  onClose,
  onConfirm,
  confirmLabel,
  showDelete = false,
  onDelete,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <Input
          placeholder={inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
        />

        <Actions>
          {showDelete && onDelete && (
            <ActionButton backgroundColor="#ff0000" onPress={onDelete}>
              <ActionText>Excluir</ActionText>
            </ActionButton>
          )}
          <ActionButton backgroundColor="#4B5563" onPress={onClose}>
            <ActionText>Cancelar</ActionText>
          </ActionButton>
          <ActionButton backgroundColor="#038082" onPress={onConfirm}>
            <ActionText>{confirmLabel}</ActionText>
          </ActionButton>
        </Actions>
      </ModalContent>
    </ModalOverlay>
  </Modal>
);

export default ExpertModal;
