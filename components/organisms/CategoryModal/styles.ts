import styled from "styled-components/native";

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
`;

export const Content = styled.View`
  width: 80%;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 12px;
  align-items: center;
`;

export const Title = styled.Text`
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

export const CancelButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: #4b5563;
  border-radius: 8px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;
