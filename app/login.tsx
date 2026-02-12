import React, { useState } from "react";
import {
  ActivityIndicator,
  // KeyboardAvoidingView,
  Platform,
  // ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/useAuth";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#2BAE66",
  primaryLight: "#3bc77a",
  secondary: "#264653",
  background: "#041224",
  cardBg: "#0A1929",
  text: "#FFFFFF",
  textSecondary: "#E0E0E0",
  error: "#E76F51",
  border: "#23394E",
  inputBg: "#102A3C",
  placeholder: "#8A9AAD",
};

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${COLORS.background};
`;

const StyledScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  keyboardShouldPersistTaps: "handled",
  showsVerticalScrollIndicator: false,
})``;

const Card = styled.View`
  width: 100%;
  max-width: 480px;
  background-color: ${COLORS.cardBg};
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-width: 1px;
  border-color: rgba(43, 174, 102, 0.1);
  
  ${Platform.select({
    web: `
      @media (min-width: 768px) {
        padding: 48px 40px;
      }
    `,
  })}
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const Logo = styled.Image`
  width: 120px;
  height: 120px;
  
  ${Platform.select({
    web: `
      @media (min-width: 768px) {
        width: 140px;
        height: 140px;
      }
    `,
  })}
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
  color: ${COLORS.text};
  
  ${Platform.select({
    web: `
      @media (min-width: 768px) {
        font-size: 36px;
      }
    `,
  })}
`;

const Subtitle = styled.Text`
  font-size: 16px;
  text-align: center;
  color: ${COLORS.textSecondary};
  margin-bottom: 32px;
  opacity: 0.9;
`;

const InputWrapper = styled.View`
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  border-width: 1.5px;
  border-color: ${COLORS.border};
  padding: 16px;
  width: 100%;
  border-radius: 12px;
  color: ${COLORS.text};
  background-color: ${COLORS.inputBg};
  font-size: 16px;
  
  ${Platform.select({
    web: `
      transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      &:focus {
        border-color: ${COLORS.primary};
        box-shadow: 0 0 0 3px rgba(43, 174, 102, 0.1);
        outline: none;
      }
    `,
  })}
`;

const ErrorText = styled.Text`
  color: ${COLORS.error};
  font-size: 13px;
  margin-top: 4px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const PasswordContainer = styled.View`
  width: 100%;
  position: relative;
`;

const EyeButton = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 4px;
  
  ${Platform.select({
    web: `
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    `,
  })}
`;

const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? "#4B5563" : COLORS.primary};
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  width: 100%;
  margin-top: 24px;
  border-width: 0;
  box-shadow: 0 4px 12px rgba(43, 174, 102, 0.2);
  
  ${Platform.select({
    web: `
      cursor: ${(props: { disabled: any; }) => (props.disabled ? "not-allowed" : "pointer")};
      transition: all 0.2s ease-in-out;
      
      &:hover {
        background-color: ${(props) =>
          props.disabled ? "#4B5563" : COLORS.primaryLight};
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(43, 174, 102, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    `,
  })}
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
`;

const ForgotPasswordContainer = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: 12px;
`;

const ForgotPasswordButton = styled.TouchableOpacity`
  ${Platform.select({
    web: `
      cursor: pointer;
    `,
  })}
`;

const ForgotPasswordText = styled.Text`
  color: ${COLORS.primary};
  font-size: 14px;
  font-weight: 600;
  
  ${Platform.select({
    web: `
      transition: color 0.2s ease-in-out;
      &:hover {
        color: ${COLORS.primaryLight};
        text-decoration: underline;
      }
    `,
  })}
`;

const RegisterContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 32px;
`;

const RegisterText = styled.Text`
  color: ${COLORS.textSecondary};
  font-size: 16px;
`;

const RegisterButton = styled.TouchableOpacity`
  ${Platform.select({
    web: `
      cursor: pointer;
    `,
  })}
`;

const RegisterButtonText = styled.Text`
  color: ${COLORS.primary};
  font-size: 16px;
  font-weight: 700;
  margin-left: 4px;
  
  ${Platform.select({
    web: `
      transition: color 0.2s ease-in-out;
      &:hover {
        color: ${COLORS.primaryLight};
        text-decoration: underline;
      }
    `,
  })}
`;

// const Divider = styled.View`
//   width: 100%;
//   height: 1px;
//   background-color: ${COLORS.border};
//   margin: 32px 0 24px;
// `;

// const SocialLoginContainer = styled.View`
//   width: 100%;
//   gap: 16px;
// `;

// const SocialButton = styled.TouchableOpacity`
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   padding: 14px;
//   border-radius: 12px;
//   border-width: 1.5px;
//   border-color: ${COLORS.border};
//   background-color: transparent;
//   gap: 12px;
  
//   ${Platform.select({
//     web: `
//       cursor: pointer;
//       transition: all 0.2s ease-in-out;
      
//       &:hover {
//         background-color: rgba(255, 255, 255, 0.05);
//         border-color: ${COLORS.primary};
//       }
//     `,
//   })}
// `;

// const SocialButtonText = styled.Text`
//   color: ${COLORS.text};
//   font-size: 16px;
//   font-weight: 500;
// `;

export default function Login() {
  const { authenticate } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const result = await authenticate(values.email, values.password);

      if (!result.success) {
        Toast.show({
          type: "error",
          text1: "Erro ao entrar",
          text2: result.message ?? "E-mail ou senha inválidos",
          position: "top",
          visibilityTime: 4000,
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Login realizado com sucesso!",
        position: "top",
      });

      router.replace("/(tabs)");
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro inesperado",
        text2: "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <StyledScrollView>
        <Stack.Screen options={{ 
          title: "Login",
          headerShown: false 
        }} />

        <Card style={{ backgroundColor: "transparent" }}>
          <LogoContainer>
            <Logo source={require("../assets/images/logo-comandante.png")} />
          </LogoContainer>

          <Title>Bem-vindo 👋</Title>
          <Subtitle>Entre com sua conta para continuar</Subtitle>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("E-mail inválido")
                .required("E-mail obrigatório"),
              password: Yup.string()
                .min(6, "Mínimo 6 caracteres")
                .required("Senha obrigatória"),
            })}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <InputWrapper>
                  <Input
                    placeholder="E-mail"
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <ErrorText>{errors.email}</ErrorText>
                  )}
                </InputWrapper>

                <InputWrapper>
                  <PasswordContainer>
                    <Input
                      placeholder="Senha"
                      placeholderTextColor={COLORS.placeholder}
                      secureTextEntry={!showPassword}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      style={{ paddingRight: 44 }}
                    />

                    <EyeButton onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color={COLORS.placeholder}
                      />
                    </EyeButton>
                  </PasswordContainer>

                  {errors.password && touched.password && (
                    <ErrorText>{errors.password}</ErrorText>
                  )}
                </InputWrapper>

                <ForgotPasswordContainer>
                  <ForgotPasswordButton 
                    onPress={() => router.push("/forgot-password")}
                  >
                    <ForgotPasswordText>
                      Esqueci minha senha
                    </ForgotPasswordText>
                  </ForgotPasswordButton>
                </ForgotPasswordContainer>

                <Button onPress={handleSubmit as any} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <ButtonText>Entrar</ButtonText>
                  )}
                </Button>

                <RegisterContainer>
                  <RegisterText>Não tem cadastro? </RegisterText>
                  <RegisterButton onPress={() => router.push("/signup")}>
                    <RegisterButtonText>Cadastre-se</RegisterButtonText>
                  </RegisterButton>
                </RegisterContainer>

                {/* <Divider /> */}

                {/* <SocialLoginContainer>
                  <SocialButton>
                    <Ionicons name="logo-google" size={22} color="#fff" />
                    <SocialButtonText>Continuar com Google</SocialButtonText>
                  </SocialButton>
                  
                  <SocialButton>
                    <Ionicons name="logo-apple" size={22} color="#fff" />
                    <SocialButtonText>Continuar com Apple</SocialButtonText>
                  </SocialButton>
                </SocialLoginContainer> */}
              </>
            )}
          </Formik>
        </Card>
      </StyledScrollView>
    </Container>
  );
}