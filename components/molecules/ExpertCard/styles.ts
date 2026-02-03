import styled from "styled-components/native";
export const Card = styled.TouchableOpacity`
  border-radius: 12px;
  width: 120px;
  height: 120px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
  padding: 16px;
  shadow-color: ${({ theme }) => theme.colors.text.primary};
`;


export const CardLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
`;

export const IconContainer = styled.View`
  margin-bottom: 8px;
`;