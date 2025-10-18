import React from "react";
import { Modal, Switch, View } from "react-native";
import Input from "@/components/atoms/Input";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Actions,
  ActionButton,
  ActionText,
} from "./styles";
import Label from "@/components/atoms/Label";
import { Text } from "react-native";
interface ExpertModalProps {
  visible: boolean;
  title: string;
  showSwitch: boolean;
  switchLabel: string;
  switchValue: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  showDelete?: boolean;
  onDelete?: () => void;
  onSwitchChange?: (value: boolean) => void;
  inputPlaceholder: string;
  showColorPicker?: boolean;
  colors?: string[];
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}

const ExpertModal: React.FC<ExpertModalProps> = ({
  visible,
  title,
  value,
  inputPlaceholder,
  switchValue = false,
  onSwitchChange,
  onChangeText,
  switchLabel,
  onClose,
  onConfirm,
  confirmLabel,
  showDelete = false,
  onDelete,
  showSwitch = false,
  showColorPicker = false,
  colors,
  selectedColor,
  onColorChange,
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

        {showSwitch && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Label>{switchLabel}</Label>
            <Switch value={switchValue} onValueChange={onSwitchChange} />
          </View>
        )}

        {showColorPicker && colors && onColorChange && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}
          >
            {colors.map((color) => (
              <View
                key={color}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: color,
                  margin: 4,
                  borderWidth: selectedColor === color ? 2 : 0,
                  borderColor: "#fff",
                }}
              >
                <Text
                  style={{ flex: 1 }}
                  onPress={() => onColorChange(color)}
                />
              </View>
            ))}
          </View>
        )}

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
