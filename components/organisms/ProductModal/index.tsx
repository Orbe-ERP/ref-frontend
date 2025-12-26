import React, { useState, useEffect } from "react";
import { Modal, TouchableOpacity, FlatList, View } from "react-native";
import Input from "@/components/atoms/Input";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Actions,
  ActionButton,
  ActionText,
  SectionLabel,
  KitchenSelector,
  KitchenText,
  Text,
  Divider,
} from "./styles";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductInput,
} from "@/services/product";
import { Kitchen } from "@/services/kitchen";
import CustomSwitch from "@/components/atoms/CustomSwitch";
import Toast from "react-native-toast-message";

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product?: Product;
  categoryId: string;
  restaurantId: string;
  onSaved: () => void;
  kitchens: Kitchen[];
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  product,
  categoryId,
  restaurantId,
  onSaved,
  kitchens,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [active, setActive] = useState(true);
  const [isKitchenModalVisible, setIsKitchenModalVisible] = useState(false);


  useEffect(() => {
    setName(product?.name ?? "");
    setPrice(product?.price?.toString() ?? "");
    setKitchen(product?.kitchens ?? kitchens[0]?.id ?? "");
    setActive(product?.active ?? true);
  }, [product, kitchens]);

  async function handleSave() {
    try {
      if (product) {
        await updateProduct({
          id: product.id,
          name,
          price: parseFloat(price),
          active,
          kitchen,
          restaurantId,
        });
      } else {
        const input: ProductInput = {
          name,
          price: parseFloat(price),
          active,
          kitchen: kitchens.find((k) => k.id === kitchen) as Kitchen,
          categoryId,
          restaurantId,
        };
        await createProduct(input);
      }
      onSaved();
      onClose();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar produto",
        text2: "Por favor, tente novamente.",
      });
    }
  }

  async function handleDelete() {
    if (!product) return;
    try {
      await deleteProduct(restaurantId, product.id);
      onSaved();
      onClose();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir produto",
        text2: "Por favor, tente novamente.",
      });    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalTitle>{product ? "Editar Produto" : "Novo Produto"}</ModalTitle>

          <Input
            placeholder="Nome do produto"
            value={name}
            onChangeText={setName}
          />
          <Input
            placeholder="Preço"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Divider />

          <SectionLabel>Cozinha</SectionLabel>
          <KitchenSelector onPress={() => setIsKitchenModalVisible(true)}>
            <KitchenText>
              {kitchens.find((k) => k.id === kitchen)?.name ||
                "Selecionar cozinha"}
            </KitchenText>
          </KitchenSelector>

          <Divider />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text>Ativo</Text>

            <CustomSwitch value={active} onValueChange={setActive} />
          </View>

          <Actions>
            {product && (
              <ActionButton backgroundColor="#dc2626" onPress={handleDelete}>
                <ActionText>Excluir</ActionText>
              </ActionButton>
            )}
            <ActionButton backgroundColor="#6b7280" onPress={onClose}>
              <ActionText>Cancelar</ActionText>
            </ActionButton>
            <ActionButton backgroundColor="#059669" onPress={handleSave}>
              <ActionText>{product ? "Salvar" : "Criar"}</ActionText>
            </ActionButton>
          </Actions>
        </ModalContent>
      </ModalOverlay>

      <Modal
        visible={isKitchenModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsKitchenModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContent style={{ maxHeight: "60%" }}>
            <ModalTitle>Selecionar Cozinha</ModalTitle>
            <FlatList
              data={kitchens}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: "#333",
                  }}
                  onPress={() => {
                    setKitchen(item.id);
                    setIsKitchenModalVisible(false);
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <ActionButton
              onPress={() => setIsKitchenModalVisible(false)}
            >
              <ActionText>Fechar</ActionText>
            </ActionButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Modal>
  );
};

export default ProductModal;
