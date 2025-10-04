import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Formik } from "formik";
import React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import styled from "styled-components/native";

interface Props {
  initialValues: any;
  validationSchema?: any;
  onSubmit: (values: any) => void;
  loading: boolean;
}

const FormContainer = styled.View`
  flex: 1;

  gap: 16px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

export const RestaurantForm: React.FC<Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loading,
}) => (
  <ScrollView contentContainerStyle={{ padding: 20 }}>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize // ⚠️ importante para atualizar valores quando carregam do backend
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <FormContainer>
          <Title>Dados Gerais do Restaurante</Title>

          <Input
            placeholder="Nome no CNPJ"
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
          />

          <Input
            placeholder="Nome Fantasia"
            value={values.tradeName}
            onChangeText={handleChange("tradeName")}
            onBlur={handleBlur("tradeName")}
          />

          <Input
            placeholder="CNPJ"
            value={values.cnpj}
            onChangeText={handleChange("cnpj")}
            onBlur={handleBlur("cnpj")}
            keyboardType="numeric"
          />

          <Button
            onPress={() => handleSubmit()}
            label={loading ? <ActivityIndicator color="#fff" /> : "Salvar"}
            variant="primary"
          />
        </FormContainer>
      )}
    </Formik>
  </ScrollView>
);
