import styled from "styled-components/native";

export const ModalContainer = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

export const InfoText = styled.Text`
  font-size: 13px;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ItemTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const ItemCard = styled.View`
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.overlay};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;
