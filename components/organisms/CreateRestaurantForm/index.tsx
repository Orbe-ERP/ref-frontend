import React from "react";
import { ScrollView } from "react-native";
import { Formik, getIn } from "formik";
import styled, { useTheme } from "styled-components/native";
import * as Yup from "yup";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Title from "@/components/atoms/Title";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";

interface AddressForm {
  street: string;
  houseNumber: string;
  city: string;
  neighborhood: string;
}

export interface RestaurantFormValues {
  name: string;
  tradeName?: string;
  cnpj: string;
  stateRegistration?: string;
  address: AddressForm;
}

interface Props {
  initialValues: RestaurantFormValues;
  onSubmit: (values: RestaurantFormValues) => void;
  loading: boolean;
}

function maskCnpj(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

const Container = styled(ScrollView)``

const Card = styled.View`
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  elevation: 4;
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
`;

const Col = styled.View`
  flex: 1;
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  font-size: 12px;
  margin-top: 4px;
`;

export const CreateRestaurantForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const theme = useTheme();

  const validationSchema = Yup.object({
    name: Yup.string().required("Nome é obrigatório"),
    tradeName: Yup.string().optional(),
    cnpj: Yup.string()
      .required("CNPJ obrigatório")
      .test("cnpj-valido", "CNPJ inválido", (value) =>
        cnpjValidator.isValid(value || "")
      ),
    stateRegistration: Yup.string().optional(),
    address: Yup.object({
      street: Yup.string().required("Rua é obrigatória"),
      houseNumber: Yup.string().required("Número é obrigatório"),
      city: Yup.string().required("Cidade é obrigatória"),
      neighborhood: Yup.string().required("Bairro é obrigatório"),
    }),
  });

  return (
    <Container>
      <Formik<RestaurantFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <>
            <Card>
              <SectionTitle>Dados do Restaurante</SectionTitle>

              <Input
                placeholder="Razal Social"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {getIn(touched, "name") && getIn(errors, "name") && (
                <ErrorText>{getIn(errors, "name")}</ErrorText>
              )}

              <Spacer />

              <Input
                placeholder="Nome Fantasia"
                value={values.tradeName}
                onChangeText={handleChange("tradeName")}
                onBlur={handleBlur("tradeName")}
              />

              <Spacer />

              <Input
                placeholder="CNPJ"
                keyboardType="numeric"
                value={values.cnpj}
                onChangeText={(text) => setFieldValue("cnpj", maskCnpj(text))}
                onBlur={handleBlur("cnpj")}
              />
              {getIn(touched, "cnpj") && getIn(errors, "cnpj") && (
                <ErrorText>{getIn(errors, "cnpj")}</ErrorText>
              )}

              <Spacer />

              <Input
                placeholder="Inscrição Estadual"
                keyboardType="numeric"
                value={values.stateRegistration}
                onChangeText={handleChange("stateRegistration")}
                onBlur={handleBlur("stateRegistration")}
              />
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
                  {getIn(touched, "address.street") &&
                    getIn(errors, "address.street") && (
                      <ErrorText>{getIn(errors, "address.street")}</ErrorText>
                    )}
                </Col>

                <Col>
                  <Input
                    placeholder="Número"
                    keyboardType="numeric"
                    value={values.address.houseNumber}
                    onChangeText={handleChange("address.houseNumber")}
                    onBlur={handleBlur("address.houseNumber")}
                  />
                  {getIn(touched, "address.houseNumber") &&
                    getIn(errors, "address.houseNumber") && (
                      <ErrorText>
                        {getIn(errors, "address.houseNumber")}
                      </ErrorText>
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
              {getIn(touched, "address.city") &&
                getIn(errors, "address.city") && (
                  <ErrorText>{getIn(errors, "address.city")}</ErrorText>
                )}

              <Spacer />

              <Input
                placeholder="Bairro"
                value={values.address.neighborhood}
                onChangeText={handleChange("address.neighborhood")}
                onBlur={handleBlur("address.neighborhood")}
              />
              {getIn(touched, "address.neighborhood") &&
                getIn(errors, "address.neighborhood") && (
                  <ErrorText>{getIn(errors, "address.neighborhood")}</ErrorText>
                )}
            </Card>

            <Button label="Salvar" variant="primary" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </Container>
  );
};
