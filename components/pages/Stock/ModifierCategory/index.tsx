import React, { useState, useEffect } from 'react';
import { 
  FlatList, 
  Alert, 
  RefreshControl, 
  View, 
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as S from './styles';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import Button from '@/components/atoms/Button';
import useRestaurant from '@/hooks/useRestaurant';
import { 
  getModifierCategories, 
  createModifierCategory,
  ModifierCategory, 
  deleteModifierCategory 
} from '@/services/modifierCategory';

export default function ModifierCategories() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();
  
  // Estados existentes
  const [categories, setCategories] = useState<ModifierCategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para o modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadCategories = async () => {
    if (!selectedRestaurant?.id) {
      Alert.alert('Atenção', 'Selecione um restaurante primeiro');
      return;
    }
    
    try {
      setRefreshing(true);
      const data = await getModifierCategories(selectedRestaurant.id);
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [selectedRestaurant]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Atenção', 'Informe o nome da categoria');
      return;
    }

    if (!selectedRestaurant?.id) {
      Alert.alert('Erro', 'Nenhum restaurante selecionado');
      return;
    }

    try {
      setIsCreating(true);
      
      await createModifierCategory({
        name: newCategoryName.trim(),
        restaurantId: selectedRestaurant.id
      });
      
      // Fecha o modal e limpa o campo
      setModalVisible(false);
      setNewCategoryName('');
      
      // Recarrega a lista
      await loadCategories();
      
      Alert.alert('Sucesso', 'Categoria criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      Alert.alert(
        'Erro', 
        error.message || 'Não foi possível criar a categoria. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!selectedRestaurant?.id) return;
    
    Alert.alert(
      'Confirmar exclusão',
      'Esta ação também excluirá todos os modificadores desta categoria. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteModifierCategory(id);
              await loadCategories();
              Alert.alert('Sucesso', 'Categoria excluída');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a categoria');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ModifierCategory }) => (
    <S.Card>
      <View style={{ flex: 1 }}>
        <S.ItemName>{item.name}</S.ItemName>
        {item.modifiers && (
          <S.ItemInfo>
            {item.modifiers.length} modificadores
          </S.ItemInfo>
        )}
      </View>
      <S.ActionsContainer>
        <TouchableOpacity 
          style={{ padding: 8, marginLeft: 8 }}
          onPress={() =>
            router.push({
              pathname: '/stock/modifiers/create-modifier',
              params: {
                categoryId: item.id,
              },
            })
          }
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ padding: 8, marginLeft: 8 }}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.feedback.error || '#FF3B30'} />
        </TouchableOpacity>
      </S.ActionsContainer>
    </S.Card>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Categorias de Modificadores",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <S.ScreenContainer>
        {/* Botão flutuante para criar (opcional - caso queira no corpo também) */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: theme.colors.primary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 1000,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadCategories} />
          }
          ListEmptyComponent={
            <S.EmptyContainer>
              <Ionicons name="layers-outline" size={48} color={theme.colors.text.secondary || '#999'} />
              <S.EmptyText>Nenhuma categoria criada</S.EmptyText>
              <S.EmptySubtext>
                Crie categorias para organizar seus modificadores
              </S.EmptySubtext>
              <View style={{ marginTop: 16 }}>
                <Button 
                  label="Criar Primeira Categoria" 
                  onPress={() => setModalVisible(true)}
                />
              </View>
            </S.EmptyContainer>
          }
          contentContainerStyle={{ paddingBottom: 80 }} // Espaço para o botão flutuante
        />
      </S.ScreenContainer>

      {/* Modal para criar nova categoria */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <S.ModalTitle style={{ color: theme.colors.text.primary }}>
                Nova Categoria
              </S.ModalTitle>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.colors.text.secondary + '50',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background,
                marginBottom: 24,
              }}
              placeholder="Nome da categoria"
              placeholderTextColor={theme.colors.text.secondary + '80'}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus={true}
              onSubmitEditing={handleCreateCategory}
              returnKeyType="done"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.text.secondary + '50',
                }}
                onPress={() => setModalVisible(false)}
                disabled={isCreating}
              >
                <S.ButtonText style={{ color: theme.colors.text.secondary }}>
                  Cancelar
                </S.ButtonText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: isCreating 
                    ? theme.colors.text.secondary + '50' 
                    : theme.colors.primary,
                  opacity: isCreating ? 0.7 : 1,
                }}
                onPress={handleCreateCategory}
                disabled={isCreating}
              >
                {isCreating ? (
                  <S.ButtonText style={{ color: theme.colors.text.primary }}>
                    Criando...
                  </S.ButtonText>
                ) : (
                  <S.ButtonText style={{ color: '#FFFFFF' }}>
                    Criar
                  </S.ButtonText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}