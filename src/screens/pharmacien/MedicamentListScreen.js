import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Alert, Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import MedicamentItem from "../../components/pharmacien/MedicamentItem";
import { useMedicamentStore } from "../../store/medicamentStore";

export default function MedicamentListScreen({ navigation }) {
  const { medicaments, isLoading, loadMedicaments, deleteMedicament } = useMedicamentStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadMedicaments();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [loadMedicaments, fadeAnim]);

  // Refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadMedicaments();
    });

    return unsubscribe;
  }, [navigation, loadMedicaments]);

  const handleDelete = (medicament) => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer ${medicament.nom}?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteMedicament(medicament.id);
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>💊 Médicaments</Text>
        <Text style={styles.headerSubtitle}>Gérez votre stock de médicaments</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("MedicamentForm")}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Nouveau médicament</Text>
        </TouchableOpacity>
      </LinearGradient>

      {medicaments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun médicament enregistré</Text>
          <Text style={styles.emptySubtext}>Ajoutez votre premier médicament</Text>
        </View>
      ) : (
        <FlatList
          data={medicaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicamentItem
              medicament={item}
              onEdit={() => navigation.navigate("MedicamentForm", { medicament: item })}
              onDelete={() => handleDelete(item)}
            />
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
    paddingTop: 60,
    paddingBottom: 24,
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
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
