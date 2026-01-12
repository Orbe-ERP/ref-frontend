import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const CenterContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const Header = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const FormContainer = styled.View`
  flex: 1;
  padding: 24px 16px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 24px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 6px;
`;

export const HintText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 6px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const IconWrapper = styled.View`
  padding: 0 12px;
  align-items: center;
  justify-content: center;
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  padding-vertical: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const EyeButton = styled.TouchableOpacity`
  padding: 0 12px;
  align-items: center;
  justify-content: center;
`;

export const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  margin-top: 24px;
  background-color: ${({ disabled }) => (disabled ? "#165332ff" : "#2BAE66")};
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const SubmitButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: bold;
`;
