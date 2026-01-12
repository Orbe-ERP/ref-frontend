import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const FormContainer = styled.View`
  flex: 1;
  padding: 24px 20px;
`;

export const InputGroup = styled.View`
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 14px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const IconWrapper = styled.View`
  margin-right: 8px;
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  height: 48px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const HintText = styled.Text`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 48px;
  border-radius: 8px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabled : theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-top: 12px;
`;

export const SubmitButtonText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.surface};
`;

export const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

export const LoginText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const LoginButton = styled.TouchableOpacity`
  margin-left: 4px;
`;

export const LoginButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;
