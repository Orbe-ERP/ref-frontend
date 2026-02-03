import styled from "styled-components/native";
import { Picker } from "@react-native-picker/picker";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Subtitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Input = styled.TextInput`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const PickerContainer = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 15px;
  overflow: hidden;
  min-height: 48px;
  justify-content: center;
`;

export const StyledPicker = styled(Picker)`
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: transparent;
  height: 48px;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
`;

export const ButtonWrapper = styled.View`
  flex: 1;
`;

export const DeleteButton = styled.TouchableOpacity`
  padding: 6px;
  justify-content: center;
  align-items: center;
`;

export const TaxItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  margin-top: 6px;
`;

export const TaxText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
  font-size: 14px;
  margin: 0;
  flex-shrink: 1;
`;