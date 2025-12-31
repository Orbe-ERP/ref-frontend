import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { CreateRestaurantForm } from "@/components/organisms/CreateRestaurantForm";
import { createRestaurant } from "@/services/restaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function RestaurantScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useAppTheme();

  const initialValues = {
    name: "",
    tradeName: "",
    cnpj: "",
    stateRegistration: "",
    address: {
      street: "",
      houseNumber: "",
      city: "",
      neighborhood: "",
    },
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      await createRestaurant(values);
      Toast.show({
        type: "success",
        text1: "Restaurante criado com sucesso!",
      });
      router.push("/(tabs)");
    } catch (error) {
      console.error("Erro ao criar restaurante:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao salvar o restaurante.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Criar Restaurante",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {" "}
        <CreateRestaurantForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </KeyboardAvoidingView>
    </>
  );
}
