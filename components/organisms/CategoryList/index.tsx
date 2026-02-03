import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ProductOption from "@/components/molecules/ProductOption";
import { Header, Products, Category, CategoryText, Container } from "./styles";
import { Product } from "@/services/product";

interface Props {
  categories: any[];
  expandedCategory: string | null;
  toggleCategory: (id: string) => void;
  selectedProducts: any;
  handleProductChange: (catId: string, prodId: string, q: number) => void;
  handleQuantityChange: (catId: string, prodId: string, delta: number) => void;
  handleAddProduct: (id: string, name: string, q: number) => void;
}

export default function CategoryList({
  categories,
  expandedCategory,
  toggleCategory,
  selectedProducts,
  handleProductChange,
  handleQuantityChange,
  handleAddProduct,
}: Props) {
  return (
    <Container>
      {categories.map((category) => (
        <Category key={category.id}>
          <Header
            onPress={() => toggleCategory(category.id)}
            activeOpacity={0.8}
          >
            <CategoryText>{category.name}</CategoryText>
            <Ionicons
              name={
                expandedCategory === category.id
                  ? "chevron-down"
                  : "chevron-forward"
              }
              size={20}
              color="white"
            />
          </Header>

          {expandedCategory === category.id && (
            <Products>
              {category.products.map((product: Product) => (
                <ProductOption
                  key={product.id}
                  name={product.name}
                  selected={
                    selectedProducts[category.id]?.productId === product.id
                  }
                  price={product.price}
                  quantity={selectedProducts[category.id]?.quantity || 1}
                  onSelect={() =>
                    handleProductChange(category.id, product.id, 1)
                  }
                  onIncrease={() =>
                    handleQuantityChange(category.id, product.id, 1)
                  }
                  onDecrease={() =>
                    handleQuantityChange(category.id, product.id, -1)
                  }
                  onAdd={() =>
                    handleAddProduct(
                      product.id,
                      product.name,
                      selectedProducts[category.id]?.quantity || 1
                    )
                  }
                />
              ))}
            </Products>
          )}
        </Category>
      ))}
    </Container>
  );
}
