// components/organisms/RestaurantForm.tsx
import React from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import styled from "styled-components/native";
import * as Yup from "yup";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Title from "@/components/atoms/Title";
import { cnpj } from "cpf-cnpj-validator";

interface Props {
  initialValues: any;
  onSubmit: (values: any) => void;
  loading: boolean;
}

const Container = styled(ScrollView).attrs({
  contentContainerStyle: { padding: 24 },
})``;

const Card = styled.View`
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #02142b;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 5;
`;

const SectionTitle = styled(Title)`
  font-size: 18px;
  margin-bottom: 12px;
`;

const Spacer = styled.View`
  height: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: 12px;
  flex-wrap: wrap;
`;

const Col = styled.View`
  flex: 1;
  min-width: 100px;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 12px;
  margin-bottom: 8px;
`;

export const RestaurantForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    tradeName: Yup.string().optional(),
    cnpj: Yup.string()
      .required("CNPJ obrigatório")
      .test("is-valid-cnpj", "CNPJ inválido", (value) =>
        cnpj.isValid(value || "")
      ),
    inscricaoEstadual: Yup.string()
      .matches(/^\d{3,14}$/, "Inscrição Estadual inválida")
      .optional(),
    address: Yup.object().shape({
      street: Yup.string().required("Rua é obrigatória"),
      houseNumber: Yup.string().required("Número é obrigatório"),
      city: Yup.string().required("Cidade é obrigatória"),
      neighborhood: Yup.string().required("Bairro é obrigatório"),
    }),
  });

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Card>
              <SectionTitle>Dados Gerais do Restaurante</SectionTitle>

              <Input
                placeholder="Nome no CNPJ"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {errors.name && touched.name && <ErrorText>{errors.name}</ErrorText>}

              <Spacer />

              <Input
                placeholder="Nome Fantasia"
                value={values.tradeName}
                onChangeText={handleChange("tradeName")}
                onBlur={handleBlur("tradeName")}
              />
              {errors.tradeName && touched.tradeName && <ErrorText>{errors.tradeName}</ErrorText>}

              <Spacer />

              <Input
                placeholder="CNPJ"
                value={values.cnpj}
                onChangeText={handleChange("cnpj")}
                onBlur={handleBlur("cnpj")}
                keyboardType="numeric"
              />
              {errors.cnpj && touched.cnpj && <ErrorText>{errors.cnpj}</ErrorText>}

              <Spacer />

              <Input
                placeholder="Inscrição Estadual"
                value={values.inscricaoEstadual}
                onChangeText={handleChange("stateRegistration")}
                onBlur={handleBlur("stateRegistration")}
                keyboardType="numeric"
              />
              {errors.stateRegistration && touched.stateRegistration && (
                <ErrorText>{errors.stateRegistration}</ErrorText>
              )}
            </Card>

            <Card>
              <SectionTitle>Endereço</SectionTitle>

              <Row>
                <Col>
                  <Input
                    placeholder="Rua"
                    value={values.address.street}
                    onChangeText={handleChange("address.street")}
                    onBlur={handleBlur("address.street")}
                  />
                  {errors.address?.street && touched.address?.street && (
                    <ErrorText>{errors.address.street}</ErrorText>
                  )}
                </Col>

                <Col style={{ flexBasis: 80 }}>
                  <Input
                    placeholder="Número"
                    value={values.address.houseNumber}
                    onChangeText={handleChange("address.houseNumber")}
                    onBlur={handleBlur("address.houseNumber")}
                    keyboardType="numeric"
                  />
                  {errors.address?.houseNumber && touched.address?.houseNumber && (
                    <ErrorText>{errors.address.houseNumber}</ErrorText>
                  )}
                </Col>
              </Row>

              <Spacer />

              <Input
                placeholder="Cidade"
                value={values.address.city}
                onChangeText={handleChange("address.city")}
                onBlur={handleBlur("address.city")}
              />
              {errors.address?.city && touched.address?.city && (
                <ErrorText>{errors.address.city}</ErrorText>
              )}

              <Spacer />

              <Input
                placeholder="Bairro"
                value={values.address.neighborhood}
                onChangeText={handleChange("address.neighborhood")}
                onBlur={handleBlur("address.neighborhood")}
              />
              {errors.address?.neighborhood && touched.address?.neighborhood && (
                <ErrorText>{errors.address.neighborhood}</ErrorText>
              )}
            </Card>

            <Button
              onPress={() => handleSubmit()}
              label={loading ? <ActivityIndicator color="#fff" /> : "Salvar"}
              variant="primary"
            />
          </>
        )}
      </Formik>
    </Container>
  );
};
