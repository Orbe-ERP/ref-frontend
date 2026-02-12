import { Platform } from "react-native";
import styled from "styled-components/native";
import { AppTheme } from "@/context/ThemeProvider";

// export const Container = styled.View`
//   flex: 1;
//   background-color: ${({ theme }) => theme.colors.background};
// `;

export const Header = styled.View`
  padding: 32px 24px 16px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

// export const BackButton = styled.TouchableOpacity`
//   width: 40px;
//   height: 40px;
//   border-radius: 20px;
//   background-color: ${({ theme }) => theme.colors.overlay};
//   align-items: center;
//   justify-content: center;
// `;

export const HeaderTitle = styled.Text`
  font-size: 0 24px 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.5px;
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
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 4px 0;
  transition: border-color 0.2s;
`;

export const IconWrapper = styled.View`
  padding: 0 12px;
`;

// export const StyledInput = styled.TextInput`
//   flex: 1;
//   padding: 12px 0;
//   font-size: 16px;
//   color: ${({ theme }) => theme.colors.text.primary};
// `;

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
  border-width: 1;
  border-color: ${({ theme }) => `${theme.colors.feedback.error}30`};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  font-size: 14px;
`;

// export const SubmitButton = styled.TouchableOpacity`
//   background-color: ${({ theme }) => theme.colors.primary};
//   border-radius: 8px;
//   padding: 16px;
//   align-items: center;
//   margin-top: 8px;
//   opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
// `;

export const SubmitButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
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
  padding: 24px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
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

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: ${Platform.OS === 'web' ? 'center' : 'flex-start'};
`;

export const ContentWrapper = styled.View`
  width: 100%;
  max-width: 480px;
  align-self: center;
  background-color: ${({ theme }: { theme: AppTheme }) => theme.colors.surface};
  
  ${({ theme }: { theme: AppTheme }) => Platform.select({
    web: `
      margin: 40px 0;
      border-radius: 16px;
      box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid ${theme.colors.border};
      overflow: hidden;
    `,
    default: `
      flex: 1;
    `
  })}
`;

export const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 18px;
  align-items: center;
  margin-top: 12px;
  box-shadow: 0px 4px 10px ${({ theme }) => theme.colors.primary}40;
  
  ${Platform.select({ web: 'cursor: pointer;' })}
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.overlay};
  align-items: center;
  justify-content: center;
  ${Platform.select({
    web: `cursor: pointer;`,
  })}
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  ${Platform.select({ web: 'outline-style: none;' })}
`;