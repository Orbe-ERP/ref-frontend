import React, { useState } from "react";
import { Modal } from "react-native";
import Input from "@/components/atoms/Input";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Actions,
  ActionButton,
  ActionText,
} from "./styles";
import { createProduct, updateProduct, deleteProduct, Product, ProductInput } from "@/services/product";

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product?: Product;
  categoryId: string;
  restaurantId: string;
  onSaved: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  product,
  categoryId,
  restaurantId,
  onSaved,
}) => {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [kitchen, setKitchen] = useState(product?.kitchen ?? "OTHERS");
  const [active, setActive] = useState(product?.active ?? true);

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
          kitchen,
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
          <Input placeholder="Preço" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <Input placeholder="Cozinha (MEAT, OTHERS, UNCOOKABLE)" value={kitchen} onChangeText={setKitchen} />

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
    </Modal>
  );
};

export default ProductModal;
