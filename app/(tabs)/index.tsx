import Button from "@/components/atoms/Button";
import DashboardBox from "@/components/molecules/DashboardBox";
import Header from "@/components/organisms/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function HomeScreen() {

  const salesData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        data: [100, 200, 150, 170, 220, 180, 250],
        strokeWidth: 2,
      },
    ],
  };

  const router = useRouter();
  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#041224" }}>
      <Header title={"Restaurante"}/>

      <LineChart
        data={salesData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#041224",
          backgroundGradientFrom: "#041224",
          backgroundGradientTo: "#041224",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "6", strokeWidth: "2", stroke: "#EA5A82" },
        }}
        bezier
        style={{ marginBottom: 30 }}
      />

      <Button label="Cozinha" onPress={() => {router.push('/(private)/kitchen')}} />
      <Button label="Selecionar Restaurante" onPress={() =>{router.push('/(private)/select-restaurant')}} />

      <DashboardBox
        title="Mais"
        options={[
          { label: "Relatórios", onPress: () => {return null} },
          { label: "Controle de Estoque", onPress: () => {return null}},
          { label: "Controle Financeiro", onPress: () =>{return null} },
        ]}
      />
    </ScrollView>
  );
}
