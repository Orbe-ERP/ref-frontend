import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as S from './styles';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { adjustStock } from '@/services/stock';
import { useAppTheme } from '@/context/ThemeProvider/theme';

export default function AdjustStock() {
  const { stockItemId } = useLocalSearchParams<{ stockItemId: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const [delta, setDelta] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    const value = Number(delta);

    if (!value || isNaN(value)) {
      Alert.alert('Erro', 'Informe um valor válido');
      return;
    }

    try {
      await adjustStock(stockItemId, value, note);
      Alert.alert('Sucesso', 'Estoque ajustado com sucesso');
      router.back();
    } catch {
      Alert.alert('Erro', 'Erro ao ajustar estoque');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ajuste Manual",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <S.ScreenContainer>
        <S.FieldContainer>
          <S.Label>Quantidade (+ ou -)</S.Label>
          <Input
            keyboardType="numeric"
            value={delta}
            onChangeText={setDelta}
            placeholder="Ex: -2 ou 5"
          />
        </S.FieldContainer>

        <S.FieldContainer>
          <S.Label>Observação (opcional)</S.Label>
          <Input
            value={note}
            onChangeText={setNote}
            placeholder="Quebra, perda, contagem..."
          />
        </S.FieldContainer>
        <Button label="Salvar Ajuste" onPress={handleSubmit} />
      </S.ScreenContainer>
    </>
  );
}
