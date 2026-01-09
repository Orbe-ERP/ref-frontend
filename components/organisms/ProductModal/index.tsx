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
import Button from "@/components/atoms/Button";

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
  const [active, setActive] = useState(true);

  const [kitchenIds, setKitchenIds] = useState<string[]>([]);
  const [isKitchenModalVisible, setIsKitchenModalVisible] = useState(false);

  useEffect(() => {

  if (!visible) return;


    setName(product?.name ?? "");
    setPrice(product?.price?.toString() ?? "");
    setActive(product?.active ?? true);

    setKitchenIds(product?.kitchens?.map((k: any) => k.id) ?? []);
  }, [visible, product]);

  function toggleKitchen(id: string) {
    setKitchenIds((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    try {
      if (product) {
        await updateProduct({
          id: product.id,
          name,
          price: parseFloat(price),
          active,
          kitchenIds,
          restaurantId,
        });
      } else {
        const input: ProductInput = {
          name,
          price: parseFloat(price),
          active,
          kitchenIds,
          categoryId,
          restaurantId,
        };
        await createProduct(input);
      }

      onSaved();
      onClose();
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar produto",
      });
    }
  }

  async function handleDelete() {
    if (!product) return;
    try {
      await deleteProduct(restaurantId, product.id);
      onSaved();
      onClose();
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir produto",
      });
    }
  }

  const selectedKitchens = kitchens.filter((k) => kitchenIds.includes(k.id));

  return (
    <Modal visible={visible} animationType="fade" transparent>
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

          <SectionLabel>Cozinhas</SectionLabel>
          <KitchenSelector onPress={() => setIsKitchenModalVisible(true)}>
            <KitchenText>
              {kitchenIds.length ? "Editar cozinhas" : "Selecionar cozinhas"}
            </KitchenText>
          </KitchenSelector>

          {/* 🔥 CHIPS DE COZINHAS */}
          {selectedKitchens.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10,
              }}
            >
              {selectedKitchens.map((k) => (
                <View
                  key={k.id}
                  style={{
                    backgroundColor: "#065f46",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 13 }}>{k.name}</Text>
                </View>
              ))}
            </View>
          )}

          <Divider />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
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

      {/* MODAL DE SELEÇÃO */}
      <Modal
        visible={isKitchenModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsKitchenModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContent style={{ maxHeight: "70%" }}>
            <ModalTitle>Selecionar Cozinhas</ModalTitle>

            {/* 🔥 CHIPS SEMPRE VISÍVEIS NO MODAL */}
            {selectedKitchens.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {selectedKitchens.map((k) => (
                  <View
                    key={k.id}
                    style={{
                      backgroundColor: "#065f46",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 13 }}>
                      {k.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <FlatList
              data={kitchens}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const selected = kitchenIds.includes(item.id);

                return (
                  <TouchableOpacity
                    onPress={() => toggleKitchen(item.id)}
                    style={{
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: "#333",
                      backgroundColor: selected ? "#065f46" : "transparent",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {item.name} {selected ? "✓" : ""}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            <Button
              label="Fechar"
              variant="secondary"
              onPress={() => setIsKitchenModalVisible(false)}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Modal>
  );
};

export default ProductModal;
