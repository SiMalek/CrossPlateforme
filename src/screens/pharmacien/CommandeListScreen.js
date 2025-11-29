import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import CommandeStatusBadge from "../../components/pharmacien/CommandeStatusBadge";
import { useAuthStore } from "../../store/authStore";
import { useCommandeStore } from "../../store/commandeStore";

export default function PharmacienCommandeListScreen({ navigation }) {
  const { commandes, isLoading, loadCommandesByPharmacien } = useCommandeStore();
  const { user, logout } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      loadCommandesByPharmacien(user.id);
    }
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [user, loadCommandesByPharmacien, fadeAnim]);

  // Refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (user) {
        loadCommandesByPharmacien(user.id);
      }
    });

    return unsubscribe;
  }, [navigation, user, loadCommandesByPharmacien]);

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#43e97b', '#38f9d7']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Pharmacien'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <View style={styles.statCard}>
            <Ionicons name="receipt" size={24} color="#fff" />
            <Text style={styles.statNumber}>{commandes.length}</Text>
            <Text style={styles.statLabel}>Commandes</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {commandes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune commande reçue</Text>
        </View>
      ) : (
        <FlatList
          data={commandes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate("PharmacienCommandeDetail", { commande: item })}>
              <View style={styles.cardHeader}>
                <Text style={styles.commandeId}>#{item.id}</Text>
                <CommandeStatusBadge status={item.status} />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{formatDate(item.dateCreation)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ordonnance:</Text>
                <Text style={styles.value}>#{item.ordonnanceId}</Text>
              </View>
              <Text style={styles.seeMore}>Gérer →</Text>
            </Card>
          )}
          contentContainerStyle={styles.list}
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
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "500",
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    paddingHorizontal: 24,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  commandeId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  seeMore: {
    color: "#007AFF",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
