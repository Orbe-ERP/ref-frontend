import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  View, 
  ScrollView,
  Text 
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import * as S from './styles';
import Title from '@/components/atoms/Title';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import useRestaurant from '@/hooks/useRestaurant';
import { 
  createStockItem, 
  updateStockItem, 
  getStockById, 
  Unit 
} from '@/services/stock';
import { useAppTheme } from '@/context/ThemeProvider/theme';

export default function CreateStock() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    unit: Unit.UNIT,
    quantity: '0',
    minimum: '',
    lastCost: '',
  });

  useEffect(() => {
    if (id) {
      loadStockItem();
    }
  }, [id]);

  const loadStockItem = async () => {
    try {
      const data = await getStockById(id as string);
      setForm({
        name: data.name,
        unit: data.unit || Unit.UNIT,
        quantity: data.quantity.toString(),
        minimum: data.minimum?.toString() || '',
        lastCost: data.lastCost?.toString() || '',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o item');
    }
  };

  const handleSubmit = async () => {
    if (!selectedRestaurant?.id) {
      Alert.alert('Erro', 'Restaurante não selecionado');
      return;
    }

    if (!form.name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do item');
      return;
    }

    try {
      setLoading(true);
      const stockData = {
        restaurantId: selectedRestaurant.id,
        name: form.name,
        unit: form.unit,
        quantity: parseFloat(form.quantity) || 0,
        minimum: form.minimum ? parseFloat(form.minimum) : undefined,
        lastCost: form.lastCost ? parseFloat(form.lastCost) : undefined,
      };

      if (id) {
        await updateStockItem(id as string, stockData);
        Alert.alert('Sucesso', 'Item atualizado com sucesso');
      } else {
        await createStockItem(stockData);
        Alert.alert('Sucesso', 'Item criado com sucesso');
      }
      
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <S.ScreenContainer>
        <S.Header>
          <Title>{id ? 'Editar Item' : 'Novo Item de Estoque'}</Title>
        </S.Header>

        <ScrollView 
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#666', 
              marginBottom: 8,
              fontWeight: '500' 
            }}>
              Nome do Item *
            </Text>
            <Input
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Ex: Tomate, Queijo, Pão"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#666', 
              marginBottom: 8,
              fontWeight: '500' 
            }}>
              Unidade de Medida
            </Text>
            <Picker
              selectedValue={form.unit}
              onValueChange={(value) => setForm({ ...form, unit: value })}
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              {Object.values(Unit).map((unit) => (
                <Picker.Item key={unit} label={unit} value={unit} />
              ))}
            </Picker>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#666', 
              marginBottom: 8,
              fontWeight: '500' 
            }}>
              Quantidade Inicial
            </Text>
            <Input
              value={form.quantity}
              onChangeText={(text) => setForm({ ...form, quantity: text })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#666', 
              marginBottom: 8,
              fontWeight: '500' 
            }}>
              Estoque Mínimo (opcional)
            </Text>
            <Input
              value={form.minimum}
              onChangeText={(text) => setForm({ ...form, minimum: text })}
              placeholder="Quantidade mínima para alerta"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#666', 
              marginBottom: 8,
              fontWeight: '500' 
            }}>
              Último Custo (opcional)
            </Text>
            <Input
              value={form.lastCost}
              onChangeText={(text) => setForm({ ...form, lastCost: text })}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={{ opacity: form.name.trim() ? 1 : 0.6 }}>
            <Button
              label={id ? 'Atualizar Item' : 'Criar Item'}
              onPress={form.name.trim() ? handleSubmit : () => {}}
            />
          </View>
        </ScrollView>
      </S.ScreenContainer>
    </>
  );
}