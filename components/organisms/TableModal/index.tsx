import React from "react";
import { Modal } from "react-native";
import Input from "@/components/atoms/Input";
import { ModalOverlay, ModalContent, ModalTitle, Actions, ActionButton, ActionText } from "./styles";

interface TableModalProps {
  visible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

const TableModal: React.FC<TableModalProps> = ({
  visible,
  title,
  value,
  onChangeText,
  onClose,
  onConfirm,
  confirmLabel,
  showDelete = false,
  onDelete,
}) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <Input placeholder="Digite o nome da mesa" value={value} onChangeText={onChangeText} />

        <Actions>
          {showDelete && onDelete && (
            <ActionButton backgroundColor="#DC2626" onPress={onDelete}>
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

export default TableModal;
