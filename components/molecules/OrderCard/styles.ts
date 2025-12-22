import styled from "styled-components/native";

export const ModalContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 24px;
  z-index: 999;
`;
export const ModalContent = styled.View`
  background-color: #fff;
  width: 90%;
  border-radius: 16px;
  padding: 24px;
  align-items: center;
  elevation: 6;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
`;

export const AlertIconContainer = styled.View`
  align-items: center;
  justify-content: center;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 50px;
  padding: 16px;
  margin-bottom: 12px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  text-align: center;
`;

export const ItemDetailsCentered = styled.Text`
  font-size: 15px;
  color: #374151;
  text-align: center;
  margin-top: 12px;
  line-height: 22px;
`;

export const ItemName = styled.Text`
  font-weight: bold;
  color: #ef4444;
`;

export const ModalActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
  width: 100%;
  gap: 12px;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #e5e7eb;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
`;

export const CancelText = styled.Text`
  color: #374151;
  font-weight: 600;
`;

export const ConfirmButtonDestructive = styled.TouchableOpacity`
  flex: 1;
  background-color: #dc2626;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
`;

export const ConfirmText = styled.Text`
  color: #fff;
  font-weight: 600;
`;


export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 22px;
  font-weight: bold;
`;

export const ItemContainer = styled.View<{
  borderColor: string;
  preparing?: boolean;
}>`
  margin-bottom: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 14px;
  border-width: 3;
  border-color: ${(p) => p.borderColor};
  ${({ preparing, theme }) =>
    preparing &&
    `
    border-left-width: 10px;
    border-left-color: ${theme.colors.feedback.warning};
  `}
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;



export const ItemDetails = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  margin-top: 4px;
`;

export const ItemObservations = styled.View`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
`;

export const ObservationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

export const ObservationText = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  flex: 1;
`;

export const ObservationDeleteButton = styled.TouchableOpacity`
  margin-left: 8px;
  padding: 4px;
`;

export const ActionsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const EditButton = styled.TouchableOpacity`
  padding: 4px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

export const ProductActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

export const ActionButton = styled.TouchableOpacity<{ bgColor?: string }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.bgColor || p.theme.colors.primary};
  padding: 10px;
  border-radius: 10px;
  margin-right: 6px;
`;

export const WorkInProgressButtonSyled = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.feedback.warning};
`;

export const CancelButtonStyled = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.feedback.error};
  margin-right: 0;
`;

export const ActionText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: 14px;
  margin-left: 6px;
`;



export const QuantityContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
`;

export const QtyButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const QtyText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 22px;
  font-weight: 700;
  width: 50px;
  text-align: center;
`;


export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.feedback.success};
  padding: 10px 18px;
  border-radius: 10px;
`;

