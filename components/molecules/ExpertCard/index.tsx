import React from "react";
import { View } from "react-native";
import IconButton from "@/components/atoms/IconButton";
import { Card, CardLabel, IconContainer } from "./styles";
import { 
  Utensils, 
  Pizza, 
  Coffee, 
  Sandwich, 
  Salad, 
  Cake,
  Beer,
  Wine,
  IceCream,
  ChefHat,
  Milk,
  Croissant,
  Soup,
  Apple,
  Fish,
  Drumstick,
  Beef,
  Egg,
  CupSoda
} from "lucide-react-native";
import { Table } from "@/services/table";
import { Category } from "@/services/category";
import { Product } from "@/services/product";
import { useAppTheme } from "@/context/ThemeProvider/theme";

interface ExpertCardProps {
  cardType: Table | Category | Product;
  icon?: string;
  onPress: () => void;
  onEdit: () => void;
}

// Mapeamento de palavras-chave para ícones
const getIconForCategory = (categoryName: string, isCategory: boolean, isProduct: boolean) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('pizza')) return Pizza;
  if (name.includes('café') || name.includes('coffee')) return Coffee;
  if (name.includes('hambúrguer') || name.includes('burger') || name.includes('sanduíche')) return Sandwich;
  if (name.includes('salada')) return Salad;
  if (name.includes('sobremesa') || name.includes('doce') || name.includes('cake')) return Cake;
  if (name.includes('cerveja') || name.includes('beer')) return Beer;
  if (name.includes('vinho') || name.includes('wine')) return Wine;
  if (name.includes('sorvete') || name.includes('ice')) return IceCream;
  if (name.includes('bebida') || name.includes('drink') || name.includes('refrigerante')) return CupSoda;
  if (name.includes('frango') || name.includes('chicken')) return Drumstick;
  if (name.includes('carne') || name.includes('beef') || name.includes('steak')) return Beef;
  if (name.includes('peixe') || name.includes('fish')) return Fish;
  if (name.includes('ovo') || name.includes('egg')) return Egg;
  if (name.includes('sopa') || name.includes('soup')) return Soup;
  if (name.includes('pão') || name.includes('bread') || name.includes('croissant')) return Croissant;
  if (name.includes('leite') || name.includes('milk')) return Milk;
  if (name.includes('maçã') || name.includes('apple') || name.includes('fruit')) return Apple;
  
  // Fallbacks baseados no tipo
  if (isCategory) return Utensils;
  if (isProduct) return ChefHat;
  
  return Utensils;
};

const ExpertCard: React.FC<ExpertCardProps> = ({ 
  cardType, 
  onPress, 
  onEdit, 
  icon = "restaurant" 
}) => {
  const { theme } = useAppTheme();
  
  // Determina se é categoria ou produto (não podemos usar instanceof com types)
  const isCategory = 'active' in cardType; // Categoria geralmente tem 'active'
  const isProduct = 'price' in cardType; // Produto geralmente tem 'price'
  
  // Determina qual ícone usar
  const IconComponent = getIconForCategory(cardType.name, isCategory, isProduct);
  
  return (
    <View style={{ position: "relative", width: 120, height: 120 }}>
      <Card onPress={onPress}>
        <IconContainer>
          <IconComponent 
            size={32} 
            color={theme.colors.primary} 
            strokeWidth={1.5}
          />
        </IconContainer>
        <CardLabel>{cardType.name}</CardLabel>
      </Card>
      <View style={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton icon={"pencil"} size={18} onPress={onEdit} />
      </View>
    </View>
  );
};

export default ExpertCard;