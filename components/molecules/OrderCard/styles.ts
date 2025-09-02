import styled from "styled-components/native";

export const Card = styled.View<{ borderColor: string }>`
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 12px;
  margin-vertical: 8px;
  margin-horizontal: 4px;
  border-left-width: 8px;
  border-left-color: ${(props) => props.borderColor};
  elevation: 4;
`;

export const KitchenLabel = styled.View<{ color: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${(props) => props.color};
  padding-vertical: 4px;
  padding-horizontal: 8px;
  border-radius: 12px;
`;

export const KitchenLabelText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: #374151;
`;

export const ItemContainer = styled.View`
  margin-bottom: 8px;
`;

export const ItemName = styled.Text`
  font-size: 16px;
  color: #111827;
  font-weight: bold;
`;

export const ItemDetails = styled.Text`
  font-size: 14px;
  padding-vertical: 4px;
  color: #6b7280;
`;

export const ObsText = styled.Text`
  font-size: 14px;
  color: #ff5722;
  font-style: italic;
  margin-top: 4px;
`;

export const ButtonContainer = styled.View`
  flex-direction: column;
  margin-top: 16px;
`;

export const ActionButton = styled.TouchableOpacity<{ bg: string }>`
  background-color: ${(props) => props.bg};
  padding-vertical: 10px;
  padding-horizontal: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
`;
