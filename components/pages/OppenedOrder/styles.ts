import styled from "styled-components/native";
import { Animated } from "react-native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0 12px;
  align-items: center;
`;

export const TopBar = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 12px 16px;
  border-radius: 12px;
  margin: 12px 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 3;
`;

export const OrderCountText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  font-weight: 700;
`;

export const Badge = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.feedback.success};
  padding: 4px 10px;
  border-radius: 20px;
  margin-left: 8px;
  min-width: 24px;
  align-items: center;
  justify-content: center;
`;

export const BadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export const OrderItem = styled.View<{ selected?: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  shadow-offset: 0px 2px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OrderHeader = styled.View`
  margin-left: 10px;
`;

export const OrderText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 600;
`;

export const ProductContainer = styled.View`
  margin-top: 6px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
`;

export const ProductText = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const ConcludeButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 14px 0;
  border-radius: 10px;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
`;

export const ConcludeButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-weight: bold;
  font-size: 16px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 85%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  align-items: center;
`;

export const ModalTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

export const ModalButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const ModalButton = styled.TouchableOpacity<{
  variant?: "cancel" | "confirm";
}>`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  margin: 0 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ variant, theme }) =>
    variant === "cancel" ? theme.colors.feedback.error : theme.colors.primary};
`;

export const ModalButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: bold;
`;

export const LoadingText = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 16px;
  margin: 20px 0;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  font-size: 16px;
  margin: 20px 0;
`;

export const NoOrdersText = styled.Text`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 16px;
  margin: 20px 0;
  text-align: center;
`;

export const PaymentMethodsContainer = styled.View`
  margin-top: 12px;
  width: 100%;
`;

export const PaymentMethodsText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

export const PaymentOptions = styled.View`
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`;

export const PaymentButton = styled.TouchableOpacity<{ selected?: boolean }>`
  flex-basis: 48%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 8px;
  height: 42px;
  border-radius: 6px;
  margin-bottom: 8px;
  margin: 5px;;
  background-color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.overlay};
`;

export const PaymentButtonText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected, theme }) => selected ? theme.colors.text.primary : theme.colors.text.secondary};
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;

export const TaxList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const TaxItem = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.surface};

  border-width: 1;
  border-color: ${({ theme }) => theme.colors.secondary};
  border-style: dashed;
`;

export const TaxText = styled.Text<{ selected?: boolean }>`
  font-size: 14px;
  font-weight: bold;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.surface : theme.colors.text.secondary};
`;

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 12px 16px;
  margin: 12px 0;
  width: 100%;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  padding: 0;
  margin: 0;
`;

export const SelectAllContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  width: 100%;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

export const SelectAllText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;
