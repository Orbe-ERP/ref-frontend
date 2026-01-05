import React from "react";
import { FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import * as S from "./styles";

interface Modifier {
  id: string;
  name: string;
  priceChange: number;
}

interface ModifierCategory {
  id: string;
  name: string;
  required: boolean;
  min: number;
  max: number;
  modifiers: Modifier[];
}

interface Props {
  productId: string;
  categories: ModifierCategory[];
  onChange(selected: Modifier[]): void;
}

export function ProductModifiersSelector({
  categories,
  onChange,
}: Props) {
  const theme = useTheme();
  const selected: Modifier[] = [];

  function toggle(modifier: Modifier) {
    const exists = selected.find(m => m.id === modifier.id);
    const next = exists
      ? selected.filter(m => m.id !== modifier.id)
      : [...selected, modifier];

    onChange(next);
  }

  return (
    <S.Container>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <S.CategoryCard>
            <S.CategoryTitle>{item.name}</S.CategoryTitle>

            {item.modifiers.map(mod => (
              <S.ModifierRow
                key={mod.id}
                onPress={() => toggle(mod)}
              >
                <S.ModifierName>{mod.name}</S.ModifierName>
                <S.ModifierPrice>
                  + R$ {mod.priceChange.toFixed(2)}
                </S.ModifierPrice>
              </S.ModifierRow>
            ))}
          </S.CategoryCard>
        )}
      />
    </S.Container>
  );
}
