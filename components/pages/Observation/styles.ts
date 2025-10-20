import styled from "styled-components/native";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: #041224;
  padding: 24px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const AddButtonWrapper = styled.View`
  margin-left: 8px;
  height: 44px;
  width: 44px;
  justify-content: center;
  align-items: center;
  margin-top: -18px;
`;

export const ObservationItem = styled.View`
  background-color: #1e293b;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ObservationText = styled.Text`
  color: #f8fafc;
  font-size: 16px;
`;

export const ListEmptyText = styled.Text`
  text-align: center;
  color: #94a3b8;
  margin-top: 20px;
  font-size: 14px;
`;
