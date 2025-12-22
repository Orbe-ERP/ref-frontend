import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as S from './styles';

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  onSelectProduct: (product: Product) => void;
}

export default function CategoryProductSelector({
  categories,
  onSelectProduct,
}: Props) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  function toggleCategory(id: string) {
    setExpandedCategory((prev) => (prev === id ? null : id));
  }

  return (
    <S.Container>
      {categories.map((category) => {
        const isExpanded = expandedCategory === category.id;

        return (
          <S.CategoryCard key={category.id}>
            <TouchableOpacity
              onPress={() => toggleCategory(category.id)}
            >
              <S.CategoryTitle>
                {category.name}
              </S.CategoryTitle>
            </TouchableOpacity>

            {isExpanded &&
              category.products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => onSelectProduct(product)}
                >
                  <S.ProductItem>
                    <S.ProductName>
                      {product.name}
                    </S.ProductName>
                  </S.ProductItem>
                </TouchableOpacity>
              ))}
          </S.CategoryCard>
        );
      })}
    </S.Container>
  );
}
