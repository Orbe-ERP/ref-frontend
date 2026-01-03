import styled from "styled-components/native";

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.View`
  width: 85%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 20px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;
