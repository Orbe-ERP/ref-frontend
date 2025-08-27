import React from "react";
import { Modal } from "react-native";
import { Overlay, Content, Actions, CancelButton, ConfirmButton, Title } from "./styles";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";

interface Props {
  visible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
}

export default function CategoryModal({ visible, title, value, onChangeText, onClose, onConfirm, confirmText }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Overlay>
        <Content>
          <Title>{title}</Title>
          <Input placeholder="Digite o nome da categoria" value={value} onChangeText={onChangeText} />
          <Actions>
            <CancelButton onPress={onClose}>
              <Label>Cancelar</Label>
            </CancelButton>
            <ConfirmButton onPress={onConfirm}>
              <Label>{confirmText}</Label>
            </ConfirmButton>
          </Actions>
        </Content>
      </Overlay>
    </Modal>
  );
}
