import styled from "styled-components/native";

export const ObservationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

export const ObservationText = styled.Text`
  color: #f1f5f9;
  font-size: 14px;
  flex: 1;
`;

export const ObservationDeleteButton = styled.TouchableOpacity`
  margin-left: 8px;
`;

export const QuantityContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const QtyButton = styled.TouchableOpacity``;

export const QtyText = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  width: 40px;
  text-align: center;
`;

export const Card = styled.View`
  background-color: #0f172a;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;



export const ItemContainer = styled.View<{ borderColor: string; preparing?: boolean }>`
  margin-bottom: 14px;
  background-color: #1e293b;
  padding: 12px;
  border-radius: 8px;
  border-width: 2px;
  border-color: ${(p: { borderColor: string; preparing?: boolean }) => p.borderColor};
  ${(p: { borderColor: string; preparing?: boolean }) =>
    p.preparing &&
    `
    border-left-width: 6px;
    border-left-color: #facc15;
  `}
`;

export const ItemObservations = styled.Text`
  color: #f1f5f9;
  font-size: 14px;
  margin-top: 4px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ActionsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ItemName = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ItemDetails = styled.Text`
  color: #cbd5e1;
  font-size: 14px;
`;

export const Dot = styled.View<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${(p: { color: string }) => p.color};
`;

export const EditButton = styled.TouchableOpacity``;

export const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const AddText = styled.Text`
  color: #22c55e;
  font-weight: bold;
  margin-left: 6px;
`;

export const ProductActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #029269;
  padding: 8px;
  border-radius: 8px;
  margin-right: 6px;
`;

export const WorkInProgressButtonSyled = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #facc15;
  padding: 8px;
  border-radius: 8px;
  margin-right: 6px;
`;

export const CancelButtonStyled = styled(ActionButton)`
  background-color: #ef4444;
  margin-right: 0;
`;

export const ActionText = styled.Text`
  color: #fff;
  margin-left: 4px;
  font-weight: bold;
`;

export const ModalContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: #1e293b;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
`;

export const ModalTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const Input = styled.TextInput`
  background-color: #0f172a;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const CancelButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const CancelText = styled.Text`
  color: #ef4444;
  font-weight: bold;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: #22c55e;
  padding: 8px 16px;
  border-radius: 8px;
`;

export const ConfirmText = styled.Text`
  color: #fff;
  font-weight: bold;
`;
