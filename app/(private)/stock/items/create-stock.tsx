import { useLocalSearchParams } from 'expo-router';
import CreateStock from '@/components/pages/Stock/CreateStock';

export default function EditStock() {
  const { id } = useLocalSearchParams();
  return <CreateStock />;
}