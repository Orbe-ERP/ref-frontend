import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as S from './styles';
import { useAppTheme } from '@/context/ThemeProvider/theme';

export default function StockManagement() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const menuItems = [
    {
      id: 'stock-items',
      title: 'Itens de Estoque',
      description: 'Visualizar e gerenciar itens em estoque',
      icon: 'cube-outline',
      route: '/(private)/stock/items',
    },
    {
      id: 'purchases',
      title: 'Compras',
      description: 'Registrar entradas por compra',
      icon: 'cart-outline',
      route: '/stock/purchases',
    },
    {
      id: 'product-compositions',
      title: 'Composição de Produtos',
      description: 'Vincular insumos aos produtos',
      icon: 'git-network-outline',
      route: '/(private)/stock/product-composition/composition',
    },
  ];


  return (
    <>
      <Stack.Screen
        options={{
          title: "Gerenciamento de Estoque",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <S.ScreenContainer>
        <S.MenuContainer>
          {menuItems.map((item) => (
            <S.MenuCard 
              key={item.id} 
              onPress={() => router.push(item.route as any)}
            >
              <S.IconContainer>
                <Ionicons 
                  name={item.icon as any} 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </S.IconContainer>
              <S.MenuContent>
                <S.MenuTitle>{item.title}</S.MenuTitle>
                <S.MenuDescription>{item.description}</S.MenuDescription>
              </S.MenuContent>
              <S.ArrowContainer>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                />
              </S.ArrowContainer>
            </S.MenuCard>
          ))}
        </S.MenuContainer>
      </S.ScreenContainer>
    </>
  );
}