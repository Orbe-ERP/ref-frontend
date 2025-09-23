import React from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Title from "@/components/atoms/Title";
import styled from "styled-components/native";

interface Props {
  initialValues: any;
  validationSchema: any;
  onSubmit: (values: any) => void;
  loading: boolean;
}

const FormContainer = styled.View`
  padding: 20px;
`;

export const RestaurantForm: React.FC<Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  loading,
}) => (
  <ScrollView contentContainerStyle={{ padding: 20 }}>
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
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

          <Input
            placeholder="Inscrição Estadual"
            value={values.inscriçãoEstadual}
            onChangeText={handleChange("Inscrição Estadual")}
            onBlur={handleBlur("Inscrição Estadual")}
            keyboardType="numeric"
          
          />

          <Title>Endereço</Title>

          <Input
            placeholder="Rua"
            value={values.address.street}
            onChangeText={handleChange("address.street")}
            onBlur={handleBlur("address.street")}
          
          />

          <Input
            placeholder="Número"
            value={values.address.houseNumber}
            onChangeText={handleChange("address.houseNumber")}
            onBlur={handleBlur("address.houseNumber")}
            keyboardType="numeric"
         
          />

          <Input
            placeholder="Cidade"
            value={values.address.city}
            onChangeText={handleChange("address.city")}
            onBlur={handleBlur("address.city")}
          
          />

          <Input
            placeholder="Bairro"
            value={values.address.neighborhood}
            onChangeText={handleChange("address.neighborhood")}
            onBlur={handleBlur("address.neighborhood")}
            
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
