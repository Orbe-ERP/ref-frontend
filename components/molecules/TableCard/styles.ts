import styled from "styled-components/native";

export const Card = styled.TouchableOpacity`
  border-radius: 10px;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 16px;
  shadow-color: ${({ theme }) => theme.colors.text.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 6;
  transition: all 0.2s ease-in-out;
`;

export const CardLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
`;
