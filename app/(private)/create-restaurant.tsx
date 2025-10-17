// app/(protected)/restaurant/RestaurantScreen.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { Stack, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { RestaurantForm } from "@/components/organisms/RestaurantForm";
import { createRestaurant } from "@/services/restaurant";
import { COLORS } from "@/theme/colors";

export default function RestaurantScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
          headerStyle: { backgroundColor: COLORS.dark.primary },
          headerTintColor: COLORS.dark.text.primary,
          headerTitleStyle: { color: COLORS.dark.text.primary },
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#041224" }}>
        <RestaurantForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </View>
    </>
  );
}
