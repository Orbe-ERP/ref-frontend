import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import * as S from './styles';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

import useRestaurant from '@/hooks/useRestaurant';
import { useAppTheme } from '@/context/ThemeProvider/theme';

import { createModifier } from '@/services/modifier';
import { getModifierCategories, ModifierCategory } from '@/services/modifierCategory';
import { getStockItems, StockItem } from '@/services/stock';

export default function CreateModifier() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const [name, setName] = useState('');
  const [type, setType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [quantity, setQuantity] = useState('1');
  const [priceChange, setPriceChange] = useState('');
  const [stockItemId, setStockItemId] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const [categories, setCategories] = useState<ModifierCategory[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRestaurant?.id) return;

    Promise.all([
      getModifierCategories(selectedRestaurant.id),
      getStockItems(selectedRestaurant.id),
    ]).then(([cats, stock]) => {
      setCategories(cats);
      setStockItems(stock);
    });
  }, [selectedRestaurant]);

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Erro', 'Informe o nome do modificador');
      return;
    }

    if (!stockItemId) {
      Alert.alert('Erro', 'Selecione um insumo do estoque');
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      Alert.alert('Erro', 'Quantidade inválida');
      return;
    }

    try {
      setLoading(true);

      await createModifier({
        name,
        type,
        quantity: qty,
        priceChange: priceChange ? Number(priceChange) : 0,
        stockItemId,
        categoryId: categoryId || null,
        restaurantId: selectedRestaurant!.id,
      });

      Alert.alert('Sucesso', 'Modificador criado');
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível criar o modificador');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Novo Modificador',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        <S.Label>Nome</S.Label>
        <Input
          placeholder="Ex: Carne extra"
          value={name}
          onChangeText={setName}
        />

        <S.Label>Tipo</S.Label>
        <Picker selectedValue={type} onValueChange={setType}>
          <Picker.Item label="Adicionar (ADD)" value="ADD" />
          <Picker.Item label="Remover (REMOVE)" value="REMOVE" />
        </Picker>

        <S.Label>Quantidade</S.Label>
        <Input
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <S.Label>Acréscimo de preço (opcional)</S.Label>
        <Input
          keyboardType="numeric"
          value={priceChange}
          onChangeText={setPriceChange}
        />

        <S.Label>Insumo do estoque</S.Label>
        <Picker
          selectedValue={stockItemId}
          onValueChange={setStockItemId}
        >
          <Picker.Item label="Selecione um insumo" value="" />
          {stockItems.map((item) => (
            <Picker.Item
              key={item.id}
              label={item.name}
              value={item.id}
            />
          ))}
        </Picker>

        <S.Label>Categoria (opcional)</S.Label>
        <Picker
          selectedValue={categoryId}
          onValueChange={setCategoryId}
        >
          <Picker.Item label="Sem categoria" value={undefined} />
          {categories.map((cat) => (
            <Picker.Item
              key={cat.id}
              label={cat.name}
              value={cat.id}
            />
          ))}
        </Picker>

        <Button
          label="Criar modificador"
          onPress={handleCreate}
        />
      </S.ScreenContainer>
    </>
  );
}
