import styled from "styled-components/native";

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 80%;
  background-color: #1e293b;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: 12px;
  align-items: center;
`;

export const ModalTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

interface ActionButtonProps {
  backgroundColor?: string;
}

export const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  padding: 10px;
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor ?? theme.colors.text.primary};
  border-radius: 8px;
  flex: 1;
  margin: 0 4px;
  align-items: center;
`;

export const ActionText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};  
  font-weight: bold;
`;
