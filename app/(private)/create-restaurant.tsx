import React, { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";
import { createRestaurant } from "@/services/restaurant";
import { RestaurantForm } from "@/components/organisms/RestaurantForm";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  tradeName: Yup.string().optional(),
  cnpj: Yup.string().required("CNPJ obrigatório"),
  address: Yup.object().shape({
    street: Yup.string().required("Rua é obrigatória"),
    houseNumber: Yup.string().required("Número é obrigatório"),
    city: Yup.string().required("Cidade é obrigatória"),
    neighborhood: Yup.string().required("Bairro é obrigatório"),
  }),
});

export default function RestaurantScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      await createRestaurant(values);

      Toast.show({
        type: "success",
        text1: "Restaurante criado com sucesso!",
      });

      router.push("/(private)/select-restaurant");
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro ao salvar o restaurante.",
      });
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: "",
    tradeName: "",
    cnpj: "",
    inscriçãoEstadual: "",
    regimeTributário: "",
    address: {
      street: "",
      houseNumber: "",
      city: "",
      neighborhood: "",
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#041224" }}>
      <RestaurantForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </View>
  );
}
