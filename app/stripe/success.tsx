import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function SubscriptionSuccess() {
  const router = useRouter();

  useEffect(() => {
    Toast.show({
      type: 'success',
      text1: 'Assinatura ativa 🎉',
      text2: 'Seu plano foi ativado com sucesso',
    });

    const timeout = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
