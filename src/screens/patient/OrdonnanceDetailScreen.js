import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useMedicamentStore } from "../../store/medicamentStore";

export default function OrdonnanceDetailScreen({ route, navigation }) {
  const { ordonnance } = route.params;
  const { medicaments, loadMedicaments } = useMedicamentStore();
  const [medicamentDetails, setMedicamentDetails] = useState([]);

  useEffect(() => {
    loadMedicaments();
  }, [loadMedicaments]);

  useEffect(() => {
    if (medicaments.length > 0 && ordonnance.medicaments) {
      const details = ordonnance.medicaments.map((med) => {
        const medicament = medicaments.find((m) => m.id === med.idMedicament);
        return {
          ...med,
          ...medicament,
        };
      });
      setMedicamentDetails(details);
    }
  }, [medicaments, ordonnance]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>📋 Détails ordonnance</Text>
        <Text style={styles.headerSubtitle}>#{ordonnance.id}</Text>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.label}>Date de prescription</Text>
                <Text style={styles.value}>{formatDate(ordonnance.date)}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.label}>Médecin</Text>
                <Text style={styles.value}>Dr. Pierre Durant</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={22} color="#007AFF" />
            <Text style={styles.sectionTitle}>Médicaments prescrits</Text>
          </View>
          
          {medicamentDetails.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="time-outline" size={32} color="#ccc" />
              <Text style={styles.emptyText}>Chargement des médicaments...</Text>
            </View>
          ) : (
            medicamentDetails.map((med, index) => (
              <View key={index} style={styles.medicamentItem}>
                <View style={styles.medHeader}>
                  <View style={styles.medIconContainer}>
                    <Ionicons name="medical" size={20} color="#007AFF" />
                  </View>
                  <Text style={styles.medName}>{med.nom || "Médicament inconnu"}</Text>
                </View>
                <View style={styles.medDetails}>
                  <View style={styles.medDetailRow}>
                    <Ionicons name="flask" size={16} color="#666" />
                    <Text style={styles.medDetail}>{med.dosage} - {med.forme}</Text>
                  </View>
                  <View style={styles.medDetailRow}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.medPosology}>
                      {med.quantiteParJour} fois/jour pendant {med.duree} jours
                    </Text>
                  </View>
                </View>
                {index < medicamentDetails.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          )}
        </Card>

        <Button
          title="🛒 Commander ces médicaments"
          onPress={() => navigation.navigate("CommandeCreate", { ordonnance })}
          style={styles.button}
        />
      </ScrollView>
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
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "700",
  },
  medicamentItem: {
    marginBottom: 20,
    paddingBottom: 16,
  },
  medName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  medDetail: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
  },
  medPosology: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    marginTop: 12,
  },
});
