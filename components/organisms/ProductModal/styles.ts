import styled from "styled-components/native";

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
`;
export const Text = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ModalContent = styled.View`
  width: 88%;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 22px;
  border-radius: 16px;
  align-items: stretch;
  shadow-color: #000;
  shadow-opacity: 0.4;
  shadow-radius: 10px;
  elevation: 6;
`;

export const ModalTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 18px;
  text-align: center;
`;

export const SectionLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  margin-bottom: 8px;
`;

export const KitchenSelector = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const KitchenText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
  font-size: 15px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #2d3748;
  margin-vertical: 16px;
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

interface ActionButtonProps {
  
  backgroundColor?: string;
}

export const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  flex: 1;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  height: 100%;
  width: 100%;
  align-items: center;
  margin-right: 10px;
`;

export const ActionText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};

  font-weight: 600;
  font-size: 15px;
`;
