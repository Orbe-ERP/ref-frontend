import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Info = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Form = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.text.secondary}30;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text.secondary}40;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 14px;
  border-radius: 10px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

export const Select = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text.secondary}40;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
`;

export const SelectText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Empty = styled.View`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  align-items: center;
  margin-top: 40px;
`;