import React from "react";
import { RadioButton, Text } from "react-native-paper";
import { AppIcon } from "@/components/atoms/Icons";
import { 
  Container, OptionRow, SubOptions, QuantityText, QuantityButton, AddButton 
} from "./styles";

interface Product {
  id: string;
  name: string;
}

interface Props {
  categoryId: string;
  product: Product;
  selectedProductId?: string;
  quantity?: number;
  onSelectProduct: (categoryId: string, productId: string, quantity: number) => void;
  onQuantityChange: (categoryId: string, productId: string, delta: number) => void;
  onAddProduct: (productId: string, productName: string, quantity: number) => void;
}

export const CategoryItem: React.FC<Props> = ({
  categoryId,
  product,
  selectedProductId,
  quantity = 1,
  onSelectProduct,
  onQuantityChange,
  onAddProduct,
}) => {
  const isSelected = selectedProductId === product.id;

  return (
    <Container>
      <OptionRow>
        <RadioButton
          value={product.name}
          status={isSelected ? "checked" : "unchecked"}
          onPress={() => onSelectProduct(categoryId, product.id, 1)}
        />
        <Text style={{ color: "white" }}>{product.name}</Text>
      </OptionRow>

      {isSelected && (
        <SubOptions>
          <QuantityButton onPress={() => onQuantityChange(categoryId, product.id, -1)}>
            <Text style={{ color: "white" }}>-</Text>
          </QuantityButton>

          <QuantityText>{quantity}</QuantityText>

          <QuantityButton onPress={() => onQuantityChange(categoryId, product.id, 1)}>
            <Text style={{ color: "white" }}>+</Text>
          </QuantityButton>

          <AddButton onPress={() => onAddProduct(product.id, product.name, quantity)}>
            <AppIcon name="cart-outline" size={24} color="white" />
          </AddButton>
        </SubOptions>
      )}
    </Container>
  );
};
