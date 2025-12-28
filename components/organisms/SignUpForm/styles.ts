import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.overlay};
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const FormContainer = styled.View`
  padding: 24px;
`;

export const InputGroup = styled.View`
  margin-bottom: 24px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
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
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const EyeButton = styled.TouchableOpacity`
  padding: 0 12px;
`;

export const HintText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: 4px;
`;

export const ErrorContainer = styled.View`
  background-color: ${({ theme }) => `${theme.colors.feedback.error}15`};
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.feedback.error}30`};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  font-size: 14px;
`;

export const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  align-items: center;
  margin-top: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const SubmitButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 600;
`;

export const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

export const LoginText = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const LoginButton = styled.TouchableOpacity``;

export const LoginButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
`;

export const TermsContainer = styled.View`
  padding: 16px 24px 32px;
  background-color: ${({ theme }) => theme.colors.overlay};
  border-radius: 8px;
  margin: 0 24px 24px;
`;

export const TermsText = styled.Text`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  text-align: center;
  line-height: 16px;
`;

export const TermsLink = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;