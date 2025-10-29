import { Link, Stack } from "expo-router";
import { StyleSheet, View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <ThemedView style={styles.container}>
        {/* Ícone ilustrativo */}
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#ff5252" />
        </View>

        {/* Título e subtítulo */}
        <ThemedText type="title" style={styles.title}>
          Oops! Página não encontrada
        </ThemedText>

        <ThemedText type="default" style={styles.subtitle}>
          A tela que você tentou acessar não existe ou foi movida.
        </ThemedText>

        {/* Botão de retorno */}
        <Link href="/" style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>
            Voltar para o início
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // azul escuro elegante
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    backgroundColor: "rgba(255,82,82,0.1)",
    padding: 24,
    borderRadius: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.9,
  },
  link: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    transform: [{ scale: 1 }],
  },
  linkText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
