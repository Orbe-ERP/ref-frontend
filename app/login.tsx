import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/useAuth";
import styled from "styled-components/native";
import { ActivityIndicator, Image } from "react-native";

// 🎨 Paleta principal
const COLORS = {
  primary: "#038082",
  secondary: "#00B894",
  background: "#041224",
  text: "#FFFFFF",
  error: "#FF4C4C",
  border: "#2D3748",
};

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: ${COLORS.background};
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  color: ${COLORS.text};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  text-align: center;
  color: #a0aec0;
  margin-bottom: 24px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${COLORS.border};
  padding: 14px;

  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
  color: ${COLORS.text};
  background-color: #0a1b2a;
`;

const ErrorText = styled.Text`
  color: ${COLORS.error};
  font-size: 12px;
  margin-bottom: 8px;
`;

type ButtonProps = {
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ variant, disabled }: ButtonProps) =>
    disabled
      ? "#4B5563"
      : variant === "secondary"
      ? COLORS.secondary
      : COLORS.primary};
  padding: 16px;
  border-radius: 10px;
  align-items: center;
  width: 100%;
  margin-top: 12px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const Logo = styled.Image`
    width: 240;
    height: 240;
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Senha obrigatória"),
});

export default function Login() {
  const { authenticate } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    const success = await authenticate(values.email, values.password);

    if (!success) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "E-mail ou senha inválidos",
        position: "top",
        visibilityTime: 3000,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Login realizado com sucesso!",
        position: "top",
        visibilityTime: 2000,
      });
      router.replace("/select-restaurant");
    }

    setLoading(false);
  };

  return (
    <Container>
      <Stack.Screen options={{ title: "Login" }} />


    <Logo source={require("../assets/images/logo-comandante.png")}/>

      <Title>Bem-vindo 👋</Title>
      <Subtitle>Entre com sua conta para continuar</Subtitle>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="E-mail"
              placeholderTextColor="#718096"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {errors.email && touched.email && <ErrorText>{errors.email}</ErrorText>}

            <Input
              placeholder="Senha"
              placeholderTextColor="#718096"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {errors.password && touched.password && <ErrorText>{errors.password}</ErrorText>}

            <Button onPress={handleSubmit as any} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Entrar</ButtonText>}
            </Button>
          </>
        )}
      </Formik>
    </Container>
  );
}
