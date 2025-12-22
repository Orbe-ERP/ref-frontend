import styled from 'styled-components/native';

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 16px;
`;

export const WarningBox = styled.View`
  background-color: ${({ theme }) => theme.colors.feedback.error}15;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const WarningText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.feedback.error};
`;

export const FieldContainer = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
  margin-bottom: 8px;
`;
