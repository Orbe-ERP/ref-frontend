import React from "react";
import { View } from "react-native";
import Button from "@/components/atoms/Button";
import Title from "@/components/atoms/Title";
import { Text } from "@/components/atoms/Text";
import KitchenLabel from "@/components/atoms/KitchenLabel";
import Card from "@/components/atoms/Card";

export interface ProductItem {
  name: string;
  kitchen: string;
  observation?: string;
}

interface KitchenOrderCardProps {
  tableName: string;
  products: ProductItem[];
  toTake: boolean;
  mainKitchen: string;
  kitchenColor: string;
  onPrepare: () => void;
  onWaiting: () => void;
  onCancel: () => void;
}

export default function KitchenOrderCard({
  tableName,
  products,
  toTake,
  mainKitchen,
  kitchenColor,
  onPrepare,
  onWaiting,
  onCancel,
}: KitchenOrderCardProps) {
  return (
    <Card style={{ borderLeftWidth: 8, borderLeftColor: kitchenColor }}>
      <View style={{ position: "absolute", top: 8, right: 8 }}>
        <KitchenLabel color={kitchenColor}>{mainKitchen}</KitchenLabel>
      </View>

      <Title style={{ textAlign: "center", marginBottom: 12 }}>{tableName}</Title>

      {products.map((product, index) => (
        <View key={index} style={{ marginBottom: 8 }}>
          <Text weight="bold">{product.name}</Text>
          <Text color="#6B7280">{product.kitchen}</Text>
          {product.observation && <Text color="#FF5722">{product.observation}</Text>}
        </View>
      ))}

      <Text color="#6B7280">Para viagem: {toTake ? "Sim" : "Não"}</Text>

      <View style={{ marginTop: 16 }}>
        <Button label="Preparando Pedido" onPress={onPrepare} variant="secondary" />
        <Button label="Aguardando Entrega" onPress={onWaiting} variant="primary" />
        <Button label="Cancelar Pedido" onPress={onCancel} variant="danger" />
      </View>
    </Card>
  );
}
