import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { CompletedOrdersTemplate, CompletedOrder } from "@/components/template/CompletedOrdersTemplate";
import { getCompletedOrdersByTable } from "@/services/order";

const CompletedOrdersScreen = () => {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const { tableId } = useLocalSearchParams<{ tableId: string }>();
  const router = useRouter();

  const fetchCompletedOrders = async () => {
    if (!tableId) return;

    try {
      const data = await getCompletedOrdersByTable(tableId);

      console.log(data)
      setOrders(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível buscar as comandas fechadas.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

//pra quando tiver a telinha de comanda fechada
  // const handleSelectOrder = (identifier: string) => {
  //   router.push({
  //     pathname: "/completed-order-details",
  //     params: { identifier },
  //   });
  // };

  useEffect(() => {
    fetchCompletedOrders();
  }, [tableId]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Comandas Fechadas",
          headerStyle: { 
            backgroundColor: "#041224"
          }, 
        }}
      />

    </>
  );
};

export default CompletedOrdersScreen;
