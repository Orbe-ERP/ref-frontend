import { useLocalSearchParams } from 'expo-router';
import CreateModifier from '@/components/pages/Stock/Modifiers';

export default function EditModifier() {
  const { id } = useLocalSearchParams();
  return <CreateModifier />;
}