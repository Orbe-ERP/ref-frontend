import styled from "styled-components/native";

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
  border-width: 3px;
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

export const ItemName = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 17px;
  font-weight: 700;
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

export const ModalContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

export const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  elevation: 5;
`;

export const ModalTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 20px;
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

export const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const CancelButton = styled.TouchableOpacity`
  margin-right: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.disabled.background};
`;

export const CancelText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  font-weight: 700;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.feedback.success};
  padding: 10px 18px;
  border-radius: 10px;
`;

export const ConfirmText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
`;
