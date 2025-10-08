import { ScrollView, StyleSheet } from 'react-native';
import { TopProductsChart } from '@/components/organisms/TopProductsChart';
import { Stack } from 'expo-router';

export default function DashboardScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Dashboard',
          headerStyle: { 
            backgroundColor: "#041224"
          }, 
        }} 
      />
      
      <ScrollView style={styles.container}>
        <TopProductsChart 
          variant="full"
          showFilters={true}
          showInsights={true}
          showRefreshButton={true}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041224',
  },
});