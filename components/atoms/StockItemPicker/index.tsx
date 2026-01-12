import { Select, SelectText } from "@/components/pages/Modifiers/styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import React, { useState } from "react";
import { Modal, FlatList, TouchableOpacity, Text, View, Platform, ActionSheetIOS } from "react-native";

interface StockPickerProps {
  stockItems: { id: string; name: string }[];
  stockItemId: string | null;
  setStockItemId: (id: string | null) => void;
}

export function StockPicker({ stockItems, stockItemId, setStockItemId }: StockPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

    const {theme} = useAppTheme()

  const openPicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", ...stockItems.map(i => i.name)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) return;
          setStockItemId(stockItems[buttonIndex - 1].id);
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Select onPress={openPicker}>
        <SelectText>
          {stockItemId
            ? stockItems.find(i => i.id === stockItemId)?.name
            : "Selecionar item de estoque"}
        </SelectText>
      </Select>

{Platform.OS !== "ios" && (
  <Modal visible={modalVisible} transparent animationType="slide">
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: theme.colors.background + "55", 
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.surface,
          padding: 16,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          maxHeight: "60%",
        }}
      >
        <FlatList
          data={[{ id: "close-btn", name: "Fechar" }, ...stockItems]} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (item.id === "close-btn") {
              return (
                <TouchableOpacity
                  style={{ padding: 16 }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ fontWeight: "bold", textAlign: "center", color: theme.colors.primary }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                style={{ padding: 16 }}
                onPress={() => {
                  setStockItemId(item.id);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: theme.colors.text.primary, fontWeight: 600 }}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator
        />
      </View>
    </View>
  </Modal>
)}



    </>
  );
}
