import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import * as S from './styles';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import Button from '@/components/atoms/Button';
import useRestaurant from '@/hooks/useRestaurant';

import { getCategories } from '@/services/category';
import {
  deleteComposition,
  getCompositionsByProduct,
  ProductComposition,
} from '@/services/product-composition';

export default function ProductCompositions() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [compositions, setCompositions] = useState<ProductComposition[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCompositions, setLoadingCompositions] = useState(false);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    Toast.show({
      type,
      text1: type === 'error' ? 'Erro' : 
             type === 'success' ? 'Sucesso' : 
             type === 'warning' ? 'Aviso' : 'Informação',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    async function loadCategories() {
      if (!selectedRestaurant?.id) return;

      setLoadingCategories(true);
      try {
        const data = await getCategories(selectedRestaurant.id);
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
        showToast('error', 'Não foi possível carregar as categorias');
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, [selectedRestaurant]);

  const loadCompositions = useCallback(async () => {
    if (!selectedProduct?.id) {
      setCompositions([]);
      return;
    }

    setLoadingCompositions(true);
    try {
      const data = await getCompositionsByProduct(selectedProduct.id);
      setCompositions(data);
      
      if (data.length === 0) {
        showToast('info', 'Nenhum ingrediente encontrado. Adicione o primeiro!');
      }
    } catch (error) {
      console.error('Error loading compositions:', error);
      showToast('error', 'Não foi possível carregar a composição');
      setCompositions([]);
    } finally {
      setLoadingCompositions(false);
      setRefreshing(false);
    }
  }, [selectedProduct]);

  useEffect(() => {
    loadCompositions();
  }, [selectedProduct]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCompositions();
  }, [loadCompositions]);

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setCompositions([]);
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
  };


  const handleDeleteComposition = async (compositionId: string) => {
  try {
    await deleteComposition(compositionId);
    showToast('success', 'Ingrediente removido da composição');
    loadCompositions();
  } catch (error) {
    console.error(error);
    showToast('error', 'Erro ao remover ingrediente');
  }
};

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedProduct(null);
    setCompositions([]);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setCompositions([]);
  };



  const handleAddComposition = () => {
    if (!selectedProduct) return;
    
    router.push({
      pathname: '/stock/product-composition/add',
      params: { 
        productId: selectedProduct.id,
        productName: selectedProduct.name
      },
    });
  };

  const totalIngredients = compositions.length;

function renderCompositionItem({ item }: { item: ProductComposition }) {
  const stockItemName = item.stockItem?.name ?? 'Ingrediente não encontrado';
  const quantityText = `${item.quantity} ${item.unit || 'un'}`;
  const isItemValid = item.stockItem?.name;

  return (
    <S.Card>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <S.ItemName
            style={{
              color: isItemValid
                ? theme.colors.text.primary
                : theme.colors.feedback.error,
              flex: 1,
            }}
          >
            {stockItemName}
          </S.ItemName>

          {!isItemValid && (
            <Ionicons
              name="warning-outline"
              size={16}
              color={theme.colors.feedback.warning}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        <S.ItemInfo>
          Quantidade:{' '}
          <Text style={{ fontWeight: '600' }}>{quantityText}</Text>
        </S.ItemInfo>
      </View>

      {/* 🔴 AÇÕES */}
      <TouchableOpacity
        onPress={() => handleDeleteComposition(item.id)}
        style={{
          padding: 6,
          borderRadius: 6,
          backgroundColor: theme.colors.feedback.error + '15',
        }}
      >
        <Ionicons
          name="trash-outline"
          size={18}
          color={theme.colors.feedback.error}
        />
      </TouchableOpacity>
    </S.Card>
  );
}


  function renderCategoryItem({ item }: { item: any }) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleCategorySelect(item)}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: selectedCategory?.id === item.id ? 
            theme.colors.primary : theme.colors.secondary + '30',
        }}>
          <Ionicons 
            name="folder-outline" 
            size={20} 
            color={theme.colors.text.secondary} 
            style={{ marginRight: 12 }}
          />
          <Text style={{ 
            flex: 1,
            fontSize: 16,
            color: theme.colors.text.primary,
            fontWeight: selectedCategory?.id === item.id ? '600' : '400'
          }}>
            {item.name}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.text.secondary} 
          />
        </View>
      </TouchableOpacity>
    );
  }

  function renderProductItem({ item }: { item: any }) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleProductSelect(item)}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: selectedProduct?.id === item.id ? 
            theme.colors.primary : theme.colors.secondary + '30',
        }}>
          <Ionicons 
            name="fast-food-outline" 
            size={20} 
            color={theme.colors.text.secondary} 
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 16,
              color: theme.colors.text.primary,
              fontWeight: selectedProduct?.id === item.id ? '600' : '400'
            }}>
              {item.name}
            </Text>
            {item.price && (
              <Text style={{ 
                fontSize: 12,
                color: theme.colors.text.secondary,
                marginTop: 2
              }}>
                R$ {parseFloat(item.price).toFixed(2)}
              </Text>
            )}
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.text.secondary} 
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: selectedProduct ? selectedProduct.name : 
                selectedCategory ? selectedCategory.name : 
                'Composição de Produtos',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerBackVisible: true,
          headerBackTitle: 'Voltar',
          
  }}
/>

      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* 🔹 TELA 1: Lista de Categorias */}
        {!selectedCategory && !selectedProduct && (
          <>
            <View style={{ padding: 16 }}>
              <S.Label>Categorias de Produtos</S.Label>
              {loadingCategories ? (
                <View style={{ 
                  padding: 20, 
                  alignItems: 'center',
                  backgroundColor: theme.colors.surface,
                  borderRadius: 8,
                }}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={{ 
                    marginTop: 8, 
                    fontSize: 12,
                    color: theme.colors.text.secondary 
                  }}>
                    Carregando categorias...
                  </Text>
                </View>
              ) : categories.length === 0 ? (
                <S.EmptyContainer>
                  <View style={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: 50,
                    backgroundColor: theme.colors.primary + '10',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 24
                  }}>
                    <Ionicons
                      name="folder-outline"
                      size={48}
                      color={theme.colors.primary}
                    />
                  </View>
                  <S.EmptyText>Nenhuma categoria encontrada</S.EmptyText>
                  <S.EmptySubtext>
                    Cadastre categorias e produtos primeiro para começar
                  </S.EmptySubtext>
                </S.EmptyContainer>
              ) : (
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCategoryItem}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </>
        )}

        {/* 🔹 TELA 2: Produtos da Categoria */}
        {selectedCategory && !selectedProduct && (
          <>
            <View style={{ padding: 16 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 16 
              }}>
                <Ionicons 
                  name="folder-outline" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={{ marginRight: 8 }}
                />
                <Text style={{ 
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.text.primary
                }}>
                  {selectedCategory.name}
                </Text>
              </View>

              {!selectedCategory.products || selectedCategory.products.length === 0 ? (
                <S.EmptyContainer>
                  <View style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 40,
                    backgroundColor: theme.colors.primary + '10',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16
                  }}>
                    <Ionicons
                      name="fast-food-outline"
                      size={40}
                      color={theme.colors.primary}
                    />
                  </View>
                  <S.EmptyText>Nenhum produto nesta categoria</S.EmptyText>
                  <S.EmptySubtext>
                    Adicione produtos para visualizar suas composições
                  </S.EmptySubtext>
                </S.EmptyContainer>
              ) : (
                <FlatList
                  data={selectedCategory.products}
                  keyExtractor={(item) => item.id}
                  renderItem={renderProductItem}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </>
        )}

        {/* 🔹 TELA 3: Composição do Produto */}
        {selectedProduct && (
          <>
            {/* Header do Produto */}
            <View style={{ 
              paddingHorizontal: 16, 
              paddingVertical: 12,
              backgroundColor: theme.colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.secondary + '20',
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 8 
              }}>
                <View style={{ flex: 1 }}>
                  <S.ProductTitle>
                    {selectedProduct.name}
                  </S.ProductTitle>
                  {selectedProduct.price && (
                    <Text style={{ 
                      fontSize: 14, 
                      color: theme.colors.text.secondary,
                      marginTop: 2
                    }}>
                      Preço: R$ {parseFloat(selectedProduct.price).toFixed(2)}
                    </Text>
                  )}
                </View>
                
                <Button
                  label="Ingrediente"
                  onPress={handleAddComposition}
                  icon={<Ionicons name="add" size={16} color="#fff" />}
                />
              </View>
              
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons 
                    name="list-outline" 
                    size={14} 
                    color={theme.colors.text.secondary} 
                  />
                  <Text style={{ 
                    fontSize: 12, 
                    color: theme.colors.text.secondary,
                    marginLeft: 4
                  }}>
                    {totalIngredients} ingredientes
                  </Text>
                </View>
                
                <TouchableOpacity
                  onPress={onRefresh}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 4
                  }}
                >
                  <Ionicons 
                    name="refresh-outline" 
                    size={14} 
                    color={theme.colors.text.secondary} 
                  />
                  <Text style={{ 
                    fontSize: 12, 
                    color: theme.colors.text.secondary,
                    marginLeft: 4
                  }}>
                    Atualizar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Lista de Ingredientes */}
            {loadingCompositions ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ 
                  marginTop: 16, 
                  fontSize: 14,
                  color: theme.colors.text.secondary 
                }}>
                  Carregando ingredientes...
                </Text>
              </View>
            ) : (
              <FlatList
                data={compositions}
                keyExtractor={(item) => item.id}
                renderItem={renderCompositionItem}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme.colors.primary]}
                    tintColor={theme.colors.primary}
                  />
                }
                ListEmptyComponent={
                  <S.EmptyContainer>
                    <View style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 40,
                      backgroundColor: theme.colors.primary + '10',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 16
                    }}>
                      <Ionicons
                        name="git-network-outline"
                        size={40}
                        color={theme.colors.primary}
                      />
                    </View>
                    <S.EmptyText>
                      Nenhum ingrediente adicionado
                    </S.EmptyText>
                    <S.EmptySubtext>
                      Adicione ingredientes para compor este produto
                    </S.EmptySubtext>
                    
                    <Button
                      label="Adicionar Primeiro Ingrediente"
                      onPress={handleAddComposition}
                    />
                  </S.EmptyContainer>
                }
              />
            )}
          </>
        )}
      </View>
      <Toast />
    </>
  );
}