import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function SubscriptionSuccess() {
  const router = useRouter();

  useEffect(() => {
    Toast.show({
      type: 'success',
      text1: 'Assinatura ativa!',
      text2: 'Seu plano foi ativado com sucesso 🎉',
    });

    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
