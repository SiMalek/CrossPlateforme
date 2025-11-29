import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import { useAuthStore } from "../../store/authStore";
import { useCommandeStore } from "../../store/commandeStore";

// Mock pharmacies data
const PHARMACIES = [
  { id: "ph001", name: "Pharmacie Centrale", adresse: "12 Avenue principale" },
  { id: "ph002", name: "Pharmacie du Centre", adresse: "45 Rue de la Paix" },
  { id: "ph003", name: "Pharmacie de la Gare", adresse: "78 Boulevard Gare" },
];

export default function CommandeCreateScreen({ route, navigation }) {
  const { ordonnance } = route.params;
  const { addCommande } = useCommandeStore();
  const { user } = useAuthStore();

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [lieuLivraison, setLieuLivraison] = useState("");
  const [remarques, setRemarques] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateLivraison = (text) => {
    if (!text.trim()) {
      setErrors({ ...errors, lieuLivraison: "L'adresse de livraison est requise" });
    } else if (text.trim().length < 5) {
      setErrors({ ...errors, lieuLivraison: "Adresse trop courte (min 5 caractères)" });
    } else {
      const newErrors = { ...errors };
      delete newErrors.lieuLivraison;
      setErrors(newErrors);
    }
  };

  const handleCreateCommande = async () => {
    if (!selectedPharmacy) {
      Alert.alert("Erreur", "Veuillez sélectionner une pharmacie");
      return;
    }

    if (!lieuLivraison.trim()) {
      Alert.alert("Erreur", "Veuillez indiquer le lieu de livraison");
      return;
    }

    setIsSubmitting(true);

    const newCommande = {
      id: `cmd_${Date.now()}`,
      ordonnanceId: ordonnance.id,
      patientId: user.id,
      pharmacienId: selectedPharmacy.id,
      status: "en_attente",
      dateCreation: new Date().toISOString(),
      lieuLivraison: lieuLivraison.trim(),
      remarques: remarques.trim(),
    };

    try {
      await addCommande(newCommande);
      Alert.alert(
        "Succès",
        "Votre commande a été créée avec succès",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("CommandeList"),
          },
        ]
      );
    } catch (_error) {
      Alert.alert("Erreur", "Impossible de créer la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>📦 Nouvelle commande</Text>
        <Text style={styles.headerSubtitle}>Commandez vos médicaments en ligne</Text>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={22} color="#007AFF" />
            <Text style={styles.sectionTitle}>1. Choisissez votre pharmacie</Text>
          </View>
          
          <View style={styles.helpBox}>
            <Ionicons name="information-circle" size={18} color="#666" />
            <Text style={styles.helpText}>Sélectionnez la pharmacie la plus proche</Text>
          </View>
          
          {PHARMACIES.map((pharmacy) => (
            <TouchableOpacity
              key={pharmacy.id}
              style={[
                styles.pharmacyCard,
                selectedPharmacy?.id === pharmacy.id && styles.pharmacyCardSelected
              ]}
              onPress={() => setSelectedPharmacy(pharmacy)}
              activeOpacity={0.7}
            >
              <View style={styles.pharmacyIcon}>
                <Ionicons 
                  name={selectedPharmacy?.id === pharmacy.id ? "checkmark-circle" : "business"} 
                  size={28} 
                  color={selectedPharmacy?.id === pharmacy.id ? "#007AFF" : "#666"} 
                />
              </View>
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                <Text style={styles.pharmacyAddress}>{pharmacy.adresse}</Text>
              </View>
              {selectedPharmacy?.id === pharmacy.id && (
                <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="home" size={22} color="#007AFF" />
            <Text style={styles.sectionTitle}>2. Adresse de livraison</Text>
          </View>
          
          <Input
            label="Adresse complète *"
            value={lieuLivraison}
            onChangeText={(text) => {
              setLieuLivraison(text);
              validateLivraison(text);
            }}
            placeholder="Rue, numéro, ville, code postal..."
            error={errors.lieuLivraison}
            multiline
          />

          <Input
            label="Instructions de livraison (optionnel)"
            value={remarques}
            onChangeText={setRemarques}
            placeholder="Code porte, étage, horaires préférés..."
            multiline
          />
        </Card>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt" size={22} color="#007AFF" />
            <Text style={styles.summaryTitle}>Récapitulatif</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ordonnance:</Text>
            <Text style={styles.summaryValue}>#{ordonnance.id}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pharmacie:</Text>
            <Text style={styles.summaryValue}>
              {selectedPharmacy?.name || "Non sélectionnée"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison:</Text>
            <Text style={styles.summaryValue}>
              {lieuLivraison.trim() || "Non renseignée"}
            </Text>
          </View>
        </View>

        <Button
          title="📤 Confirmer la commande"
          onPress={handleCreateCommande}
          loading={isSubmitting}
          disabled={!selectedPharmacy || !lieuLivraison.trim() || errors.lieuLivraison}
          style={styles.submitButton}
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
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  helpBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
  },
  pharmacyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    backgroundColor: "#fff",
    gap: 12,
  },
  pharmacyCardSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  pharmacyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: "#666",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  submitButton: {
    marginTop: 0,
  },
});
