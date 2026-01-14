import styled from "styled-components/native";

export const FormGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 6px;
`;

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};

  padding: 16px;
`;

export const Card = styled.View`
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-bottom: 12px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Actions = styled.View`
  gap: 12px;
  display: flex;
  flex-direction: row;

`;

export const IconButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
`;
