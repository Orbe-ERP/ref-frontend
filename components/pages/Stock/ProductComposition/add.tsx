import React, { useEffect, useState } from "react";
import { 
  Stack, 
  useLocalSearchParams, 
  useRouter 
} from "expo-router";
import { 
  Picker 
} from "@react-native-picker/picker";
import { 
  View, 
  ActivityIndicator, 
  ScrollView,
  TextInput,
  Text
} from "react-native";
import Toast from "react-native-toast-message";
import * as S from "./styles";
import Button from "@/components/atoms/Button";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { getStockItems, StockItem } from "@/services/stock";
import { addComposition } from "@/services/product-composition";

export default function AddComposition() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const { productId } = useLocalSearchParams<{ productId: string }>();

  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockItemId, setStockItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Função para mostrar toast
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
    async function loadStock() {
      if (!selectedRestaurant?.id) return;

      setIsLoading(true);
      try {
        const data = await getStockItems(selectedRestaurant.id);
        setStockItems(data);
      } catch (error) {
        console.error('Error loading stock items:', error);
        showToast('error', "Erro ao carregar ingredientes");
      } finally {
        setIsLoading(false);
      }
    }

    loadStock();
  }, [selectedRestaurant]);

  // Filtrar itens baseado na busca
  const filteredItems = searchTerm.trim() === "" 
    ? stockItems 
    : stockItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Validar quantidade
  const validateQuantity = () => {
    if (!quantity.trim()) return { isValid: true, message: "" };
    
    const cleanQuantity = quantity.trim().replace(',', '.');
    const quantityNumber = parseFloat(cleanQuantity);
    
    if (isNaN(quantityNumber)) {
      return { isValid: false, message: "Quantidade inválida" };
    }
    
    if (quantityNumber <= 0) {
      return { isValid: false, message: "Quantidade deve ser maior que zero" };
    }
    
    if (quantityNumber > 1000) {
      return { isValid: false, message: "Quantidade muito alta" };
    }
    
    return { isValid: true, message: "" };
  };

  const quantityValidation = validateQuantity();

  // Calcular a unidade do item selecionado
  const selectedStockItem = stockItems.find(item => item.id === stockItemId);
  const unit = selectedStockItem?.unit || 'un';

  async function handleSave() {
    if (isSubmitting) return;

    // Validações
    if (!stockItemId) {
      showToast('warning', "Selecione um ingrediente");
      return;
    }

    if (!quantity.trim()) {
      showToast('warning', "Informe a quantidade");
      return;
    }

    if (!quantityValidation.isValid) {
      showToast('warning', quantityValidation.message);
      return;
    }

    if (!selectedStockItem) {
      showToast('error', "Ingrediente inválido");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const cleanQuantity = quantity.trim().replace(',', '.');
      const quantityNumber = parseFloat(cleanQuantity);
      
      await addComposition({
        productId,
        stockItemId,
        quantity: quantityNumber,
        unit: selectedStockItem.unit,
        restaurantId: selectedRestaurant!.id,
      });

      showToast('success', `Ingrediente adicionado: ${quantityNumber} ${unit}`);

      // Aguarda um pouco para o usuário ver o toast de sucesso
      setTimeout(() => {
        router.back();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving composition:', error);
      showToast('error', "Erro ao salvar ingrediente. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handler para mudança de quantidade
  const handleQuantityChange = (text: string) => {
    // Permite apenas números, ponto e vírgula
    const numericText = text.replace(/[^0-9,.]/g, '');
    // Remove múltiplos pontos/vírgulas
    const cleanText = numericText.replace(/([.,])(?=.*[.,])/g, '');
    setQuantity(cleanText);
  };

  // Handler para submeter pelo teclado
  const handleSubmit = () => {
    if (stockItemId && quantity.trim() && quantityValidation.isValid) {
      handleSave();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Adicionar Ingrediente",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
          headerBackTitle: "Voltar",
        }}
      />

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: theme.colors.background }}
      >
        <S.ScreenContainer>
          {/* Seção de seleção do ingrediente */}
          <View style={{ marginBottom: 24 }}>
            <S.Label>Buscar Ingrediente</S.Label>
            <TextInput
              style={{
                height: 48,
                borderWidth: 1,
                borderColor: theme.colors.secondary + '40',
                borderRadius: 8,
                paddingHorizontal: 12,
                fontSize: 16,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.surface,
              }}
              placeholder="Digite para buscar..."
              placeholderTextColor={theme.colors.text.secondary + '80'}
              value={searchTerm}
              onChangeText={setSearchTerm}
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <S.Label>Selecione o Ingrediente</S.Label>
            
            {isLoading ? (
              <View style={{ 
                padding: 16, 
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
                  Carregando ingredientes...
                </Text>
              </View>
            ) : filteredItems.length === 0 ? (
              <View style={{ 
                padding: 16, 
                alignItems: 'center',
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
              }}>
                <Text style={{ 
                  color: theme.colors.text.secondary,
                  fontSize: 14
                }}>
                  {searchTerm.trim() === "" 
                    ? "Nenhum ingrediente disponível" 
                    : "Nenhum ingrediente encontrado"}
                </Text>
              </View>
            ) : (
              <Picker
                selectedValue={stockItemId}
                onValueChange={setStockItemId}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 8,
                  height: 50,
                }}
                dropdownIconColor={theme.colors.text.primary}
              >
                <Picker.Item 
                  label="Selecione um ingrediente" 
                  value="" 
                  color={theme.colors.text.secondary}
                />
                {filteredItems.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                    color={theme.colors.text.primary}
                  />
                ))}
              </Picker>
            )}
          </View>

          {/* Seção de quantidade */}
          <View style={{ marginBottom: 32 }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginBottom: 8 
            }}>
              <S.Label>Quantidade usada no prato</S.Label>
              {selectedStockItem && (
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.primary,
                }}>
                  Unidade: {unit}
                </Text>
              )}
            </View>
            
            <View>
              <TextInput
                style={{
                  height: 48,
                  borderWidth: 1,
                  borderColor: !quantityValidation.isValid && quantity.trim() 
                    ? theme.colors.feedback.error 
                    : theme.colors.secondary + '40',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  fontSize: 16,
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.surface,
                }}
                keyboardType="numeric"
                value={quantity}
                onChangeText={handleQuantityChange}
                placeholder={`Ex: 0.5 (${unit})`}
                placeholderTextColor={theme.colors.text.secondary + '80'}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                clearButtonMode="while-editing"
                autoFocus={false}
              />
              
              {!quantityValidation.isValid && quantity.trim() && (
                <Text style={{
                  color: theme.colors.feedback.error,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 4,
                }}>
                  {quantityValidation.message}
                </Text>
              )}
            </View>
            
            {selectedStockItem && quantity.trim() && quantityValidation.isValid && (
              <View style={{ 
                marginTop: 8,
                padding: 8,
                backgroundColor: theme.colors.feedback.success + '10',
                borderRadius: 4,
                borderLeftWidth: 3,
                borderLeftColor: theme.colors.feedback.success,
              }}>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.feedback.success,
                }}>
                  ✓ Adicionar {quantity.replace(',', '.')} {unit} de {selectedStockItem.name}
                </Text>
              </View>
            )}
          </View>

          {/* Informações do ingrediente selecionado */}
          {selectedStockItem && (
            <View style={{ 
              marginBottom: 24,
              padding: 16,
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.colors.secondary + '30',
            }}>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600',
                marginBottom: 8,
                color: theme.colors.text.primary,
              }}>
                Ingrediente Selecionado
              </Text>
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginBottom: 4 
              }}>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.text.secondary 
                }}>
                  Nome:
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: '500',
                  color: theme.colors.text.primary
                }}>
                  {selectedStockItem.name}
                </Text>
              </View>
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                marginBottom: 4 
              }}>
                <Text style={{ 
                  fontSize: 12, 
                  color: theme.colors.text.secondary 
                }}>
                  Unidade:
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: '500',
                  color: theme.colors.text.primary
                }}>
                  {selectedStockItem.unit}
                </Text>
              </View>
              
              {/* Verifica se category existe antes de mostrar */}
              {(selectedStockItem as any).category && (
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between' 
                }}>
                  <Text style={{ 
                    fontSize: 12, 
                    color: theme.colors.text.secondary 
                  }}>
                    Categoria:
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    fontWeight: '500',
                    color: theme.colors.text.primary
                  }}>
                    {(selectedStockItem as any).category}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Botões de ação */}
          <View style={{ 
            flexDirection: 'row', 
            gap: 12, 
            marginTop: 'auto',
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.secondary + '20',
          }}>
            <Button
              label="Cancelar"
              onPress={() => router.back()}
              disabled={isSubmitting}
            />
            <Button
              label={isSubmitting ? "Salvando..." : "Salvar"}
              onPress={handleSave}
              disabled={isSubmitting || !stockItemId || !quantity.trim() || !quantityValidation.isValid}
            />
          </View>

          {/* Dica de uso */}
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ 
              fontSize: 11, 
              color: theme.colors.text.secondary,
              textAlign: 'center',
            }}>
              💡 Dica: Use vírgula ou ponto para casas decimais
            </Text>
          </View>
        </S.ScreenContainer>
      </ScrollView>
      <Toast />
    </>
  );
}