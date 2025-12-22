import { useLocalSearchParams } from 'expo-router';
import CreateModifierCategory from '@/components/pages/Stock/ModifierCategory';

export default function EditModifierCategory() {
  const { id } = useLocalSearchParams();
  return <CreateModifierCategory />;
}