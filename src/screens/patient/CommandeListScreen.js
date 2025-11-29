import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import CommandeItem from "../../components/patient/CommandeItem";
import { useAuthStore } from "../../store/authStore";
import { useCommandeStore } from "../../store/commandeStore";

export default function CommandeListScreen({ navigation }) {
  const { commandes, isLoading, loadCommandesByPatient } = useCommandeStore();
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('📦 CommandeList - Current user:', user);
    if (user) {
      console.log('📦 CommandeList - Loading commandes for user ID:', user.id);
      loadCommandesByPatient(user.id);
    }
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [user, loadCommandesByPatient, fadeAnim]);

  // Refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (user) {
        loadCommandesByPatient(user.id);
      }
    });

    return unsubscribe;
  }, [navigation, user, loadCommandesByPatient]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>📦 Mes Commandes</Text>
        <Text style={styles.headerSubtitle}>Suivez vos commandes en temps réel</Text>
      </LinearGradient>
      
      {commandes.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
          </View>
          <Text style={styles.emptyText}>Aucune commande</Text>
          <Text style={styles.emptySubtext}>
            Créez une commande à partir d&apos;une ordonnance
          </Text>
        </Animated.View>
      ) : (
        <Animated.FlatList
          data={commandes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommandeItem
              commande={item}
              onPress={() => navigation.navigate("CommandeDetail", { commande: item })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
});
