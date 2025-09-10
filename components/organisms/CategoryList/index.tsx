import React from "react";
import { Ionicons } from "@expo/vector-icons";
import ProductOption from "@/components/molecules/ProductOption";
import { Header, Products, Category, CategoryText } from "./styles";

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
    <>
      {categories.map((category) => (
        <Category key={category.id}>
          <Header onPress={() => toggleCategory(category.id)}>
            <CategoryText>{category.name}</CategoryText>
            <Ionicons
              name={expandedCategory === category.id ? "chevron-down" : "chevron-forward"}
              size={20}
              color="white"
            />
          </Header>

          {expandedCategory === category.id && (
            <Products>
              {category.products.map((product: any) => (
                <ProductOption
                  key={product.id}
                  name={product.name}
                  selected={selectedProducts[category.id]?.productId === product.id}
                  quantity={selectedProducts[category.id]?.quantity || 1}
                  onSelect={() => handleProductChange(category.id, product.id, 1)}
                  onIncrease={() => handleQuantityChange(category.id, product.id, 1)}
                  onDecrease={() => handleQuantityChange(category.id, product.id, -1)}
                  onAdd={() =>
                    handleAddProduct(product.id, product.name, selectedProducts[category.id]?.quantity || 1)
                  }
                />
              ))}
            </Products>
          )}
        </Category>
      ))}
    </>
  );
}


