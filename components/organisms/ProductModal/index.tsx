import React, { useState, useEffect } from "react";
import { Modal, TouchableOpacity, FlatList, Text, View, Switch } from "react-native";
import Input from "@/components/atoms/Input";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Actions,
  ActionButton,
  ActionText,
} from "./styles";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductInput,
} from "@/services/product";
import { Kitchen } from "@/services/kitchen";

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

  // Atualiza os estados sempre que o produto mudar
  useEffect(() => {
    setName(product?.name ?? "");
    setPrice(product?.price?.toString() ?? "");
    setKitchen(product?.kitchen ?? kitchens[0]?.id ?? "");
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
      console.error("Erro ao salvar produto:", err);
    }
  }

  async function handleDelete() {
    if (!product) return;
    try {
      await deleteProduct(restaurantId, product.id);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalTitle>{product ? "Editar Produto" : "Novo Produto"}</ModalTitle>

          <Input placeholder="Nome" value={name} onChangeText={setName} />
          <Input
            placeholder="Preço"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          {/* Switch para Ativo/Inativo */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <Text style={{ color: "white", marginRight: 10 }}>Ativo</Text>
            <Switch
              value={active}
              onValueChange={setActive}
              trackColor={{ false: "#767577", true: "#038082" }}
              thumbColor={active ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          {/* Seleção de cozinha */}
          <TouchableOpacity
            onPress={() => setIsKitchenModalVisible(true)}
            style={{
              backgroundColor: "#1f2937",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <Text style={{ color: "white" }}>
              {kitchens.find((k) => k.id === kitchen)?.name || "Selecionar cozinha"}
            </Text>
          </TouchableOpacity>

          <Actions>
            {product && (
              <ActionButton backgroundColor="#ff0000" onPress={handleDelete}>
                <ActionText>Excluir</ActionText>
              </ActionButton>
            )}
            <ActionButton backgroundColor="#4B5563" onPress={onClose}>
              <ActionText>Cancelar</ActionText>
            </ActionButton>
            <ActionButton backgroundColor="#038082" onPress={handleSave}>
              <ActionText>{product ? "Salvar" : "Criar"}</ActionText>
            </ActionButton>
          </Actions>
        </ModalContent>
      </ModalOverlay>

      {/* Modal de seleção de cozinha */}
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
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#333",
                  }}
                  onPress={() => {
                    setKitchen(item.id);
                    setIsKitchenModalVisible(false);
                  }}
                >
                  <Text style={{ color: "white" }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <ActionButton
              backgroundColor="#4B5563"
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
