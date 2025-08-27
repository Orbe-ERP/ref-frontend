import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Container, ScrollContainer } from "./styles";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const UserSchema = Yup.object().shape({
  name: Yup.string().required("Campo obrigatório"),
  email: Yup.string().email("Email inválido").required("Campo obrigatório"),
  password: Yup.string().min(5, "Senha deve ter pelo menos 5 caracteres").required("Campo obrigatório"),
});

interface Props {
  onSubmit: (values: { name: string; email: string; password: string }) => void;
}

const UserForm: React.FC<Props> = ({ onSubmit }) => {
  return (
    <Container>
      <ScrollContainer>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={UserSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <Input
                placeholder="Nome"
                placeholderTextColor="#999999"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />

              <Input
                placeholder="E-mail"
                placeholderTextColor="#999999"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Input
                placeholder="Senha"
                placeholderTextColor="#999999"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />

              <Button label="Criar usuário" onPress={() => handleSubmit()} />
            </>
          )}
        </Formik>
      </ScrollContainer>
    </Container>
  );
};

export default UserForm;
