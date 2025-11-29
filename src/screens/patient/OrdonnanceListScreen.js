import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OrdonnanceItem from "../../components/patient/OrdonnanceItem";
import { useAuthStore } from "../../store/authStore";
import { useOrdonnanceStore } from "../../store/ordonnanceStore";

export default function OrdonnanceListScreen({ navigation }) {
  const { ordonnances, isLoading, loadOrdonnancesByPatient } = useOrdonnanceStore();
  const { user, logout } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    console.log('👤 Current user:', user);
    if (user) {
      console.log('📲 Loading ordonnances for user ID:', user.id);
      loadOrdonnancesByPatient(user.id);
    }
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [user, loadOrdonnancesByPatient, fadeAnim, slideAnim]);

  useEffect(() => {
    console.log('📋 Ordonnances in state:', ordonnances.length, ordonnances);
    console.log('🎨 isLoading:', isLoading);
    console.log('✅ Will render:', ordonnances.length > 0 ? 'FlatList' : 'Empty state');
  }, [ordonnances, isLoading]);

  const handleLogout = () => {
    logout();
  };

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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Animated.View style={[styles.statsContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color="#fff" />
            <Text style={styles.statNumber}>{ordonnances.length}</Text>
            <Text style={styles.statLabel}>Ordonnances</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {ordonnances.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-text-outline" size={80} color="#ccc" />
          </View>
          <Text style={styles.emptyText}>Aucune ordonnance</Text>
          <Text style={styles.emptySubtext}>Vos ordonnances médicales apparaîtront ici</Text>
        </Animated.View>
      ) : (
        <Animated.FlatList
          data={ordonnances}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 30 + index * 10]
                  })
                }]
              }}
            >
              <OrdonnanceItem
                ordonnance={item}
                onPress={() => navigation.navigate("OrdonnanceDetail", { ordonnance: item })}
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
    backdropFilter: "blur(10px)",
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
    color: "#333",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
  },
});
