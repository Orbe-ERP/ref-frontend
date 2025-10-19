import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 18px;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 3;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 15px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  margin-bottom: 18px;
`;

export const CheckboxContainer = styled.View`
  margin-bottom: 12px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CheckboxItem = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.surface};
  border-width: 1.5px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 3px;
  shadow-offset: 0px 1px;
  elevation: 2;
`;

export const CheckboxText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected, theme }) =>
    selected ? theme.colors.text.primary : theme.colors.text.secondary};
  font-size: 14px;
`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 16px;
  text-align: center;
  margin-top: 80px;
  opacity: 0.8;
`;
