import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform, KeyboardAvoidingView } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { EditRestaurantForm } from "@/components/organisms/EditRestaurantForm";
import { getRestaurantById, updateRestaurant } from "@/services/restaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function EditRestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {theme} = useAppTheme()
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await getRestaurantById(id);
        setRestaurant(response);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Erro ao carregar os dados do restaurante.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRestaurant();
  }, [id]);

  const handleSubmit = async (values: any) => {
    setSaving(true);

    try {
      await updateRestaurant(id, values);
      Toast.show({
        type: "success",
        text1: "Restaurante atualizado com sucesso!",
      });
      router.push("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar o restaurante.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#041224",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#041224",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Toast />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar Restaurante",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <EditRestaurantForm
          initialValues={{
            name: restaurant.name || "",
            tradeName: restaurant.tradeName || "",
            cnpj: restaurant.cnpj || "",
            stateRegistration: restaurant.stateRegistration || "",
            address: {
              street: restaurant.address?.street || "",
              houseNumber: restaurant.address?.houseNumber || "",
              city: restaurant.address?.city || "",
              neighborhood: restaurant.address?.neighborhood || "",
            },
          }}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </KeyboardAvoidingView>
    </>
  );
}
