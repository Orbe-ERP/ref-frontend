import React from "react";
import styled from "styled-components/native";
import { Modal } from "react-native";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Content = styled.View`
  width: 80%;
  background-color: #041b38;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Button = styled.TouchableOpacity<{ danger?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  align-items: center;
  margin: 0 5px;
  background-color: ${({ danger }) => (danger ? "#dc3545" : "#038082")};
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export default function ConfirmModal({ visible, onCancel, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Overlay>
        <Content>
          <Title>Deseja fechar essa comanda?</Title>
          <Row>
            <Button danger onPress={onCancel}>
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
