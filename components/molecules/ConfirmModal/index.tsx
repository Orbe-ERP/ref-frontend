import React from "react";
import { Modal } from "react-native";
import { ButtonText, Content, Overlay, Row, Title } from "./styles";
import Button from "@/components/atoms/Button";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ visible, onCancel, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Overlay>
        <Content>
          <Title>Deseja fechar essa comanda?</Title>
          <Row>
            <Button onPress={onCancel}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={onConfirm}>
              <ButtonText>Confirmar</ButtonText>
            </Button>
          </Row>
        </Content>
      </Overlay>
    </Modal>
  );
}
