import React, { useState } from "react";
import { Stack } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import useAuth from "@/hooks/useAuth";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";

import { useRouter } from 'expo-router';


const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;
const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;
const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;
const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props:any) => (props.disabled ? "#8fbfff" : "#007AFF")};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;
const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Senha obrigatória"),
});

export default function Login() {
  const { authenticate } = useAuth();
  const [loading, setLoading] = useState(false);
const router = useRouter();



  const handleRegister = () => {
   router.push('/register'); 
return
  }

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
    }

    setLoading(false);
  };

  return (
    <Container>
      <Stack.Screen options={{ title: "Login" }} />
      <Title>Bem-vindo!</Title>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {errors.email && touched.email && <ErrorText>{errors.email}</ErrorText>}

            <Input
              placeholder="Senha"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {errors.password && touched.password && <ErrorText>{errors.password}</ErrorText>}

            <Button onPress={handleSubmit as any} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Entrar</ButtonText>}
            </Button>
              <Button onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Registrar</ButtonText>}
            </Button>
          </>
        )}
      </Formik>
    </Container>
  );
}
