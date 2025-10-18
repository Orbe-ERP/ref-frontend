import styled from "styled-components/native";

export const Card = styled.TouchableOpacity`
  border-radius: 12px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-color: ${({ theme }) => theme.colors.secondary};
  shadow-color: ${({ theme }) => theme.colors.surface};
  border-width: 2px;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 5;
`;

export const CardLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  margin-top: 8px;
  font-weight: bold;
  text-align: center;
`;
