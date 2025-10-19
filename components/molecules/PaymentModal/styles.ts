import styled from "styled-components/native";
import { Dimensions, Animated, TouchableOpacity, ScrollView } from "react-native";


export const ModalOverlay = styled(Animated.View)`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled(Animated.View)`
  width: 100%;
  max-height: 70%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 5;
`;

export const ModalTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const PaymentScroll = styled(ScrollView)`
  width: 100%;
  margin-bottom: 20px;
`;

export const PaymentButton = styled(TouchableOpacity)<{ selected?: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.surface};
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  elevation: ${({ selected }) => (selected ? 5 : 1)};
  shadow-color: #000;
  shadow-opacity: ${({ selected }) => (selected ? 0.25 : 0.1)};
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
`;

export const PaymentButtonText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }) => (selected ? "#fff" : "#ccc")};
  margin-left: 12px;
  font-weight: 700;
  font-size: 16px;
`;

export const ModalActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

export const ActionButton = styled(TouchableOpacity)<{ variant?: "cancel" | "confirm" }>`
  flex: 1;
  padding: 14px;
  margin: 0 5px;
  border-radius: 12px;
  background-color: ${({ variant }) =>
    variant === "cancel" ? "#dc3545" : "#038082"};
  align-items: center;
  justify-content: center;
`;

export const ActionText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;