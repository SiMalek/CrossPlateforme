import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import { useMedicamentStore } from "../../store/medicamentStore";

export default function MedicamentFormScreen({ route, navigation }) {
  const existingMedicament = route.params?.medicament;
  const isEditing = !!existingMedicament;

  const { addMedicament, updateMedicament } = useMedicamentStore();

  const [nom, setNom] = useState(existingMedicament?.nom || "");
  const [dosage, setDosage] = useState(existingMedicament?.dosage || "");
  const [forme, setForme] = useState(existingMedicament?.forme || "");
  const [quantiteStock, setQuantiteStock] = useState(
    existingMedicament?.quantiteStock?.toString() || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'nom':
        if (!value.trim()) {
          newErrors.nom = "Le nom est requis";
        } else if (value.trim().length < 2) {
          newErrors.nom = "Le nom doit contenir au moins 2 caractères";
        } else {
          delete newErrors.nom;
        }
        break;
      
      case 'dosage':
        if (!value.trim()) {
          newErrors.dosage = "Le dosage est requis";
        } else if (!/^\d+\s*(mg|g|ml|UI|μg)$/i.test(value.trim())) {
          newErrors.dosage = "Format: nombre + unité (ex: 500 mg)";
        } else {
          delete newErrors.dosage;
        }
        break;
      
      case 'forme':
        if (!value.trim()) {
          newErrors.forme = "La forme est requise";
        } else {
          delete newErrors.forme;
        }
        break;
      
      case 'quantiteStock':
        if (!value.trim()) {
          newErrors.quantiteStock = "La quantité est requise";
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          newErrors.quantiteStock = "Doit être un nombre positif";
        } else if (Number(value) === 0) {
          newErrors.quantiteStock = "Stock vide";
        } else {
          delete newErrors.quantiteStock;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, eval(field));
  };

  const getStockStatus = () => {
    const qty = Number(quantiteStock);
    if (isNaN(qty) || qty === 0) return null;
    if (qty < 10) return { color: '#FF3B30', icon: 'alert-circle', text: 'Stock critique' };
    if (qty < 30) return { color: '#FF9500', icon: 'warning', text: 'Stock faible' };
    return { color: '#34C759', icon: 'checkmark-circle', text: 'Stock correct' };
  };

  const stockStatus = getStockStatus();

  const handleSubmit = async () => {
    // Validate all fields
    const allTouched = { nom: true, dosage: true, forme: true, quantiteStock: true };
    setTouched(allTouched);
    
    validateField('nom', nom);
    validateField('dosage', dosage);
    validateField('forme', forme);
    validateField('quantiteStock', quantiteStock);

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      Alert.alert("Erreur de validation", "Veuillez corriger les erreurs avant de continuer");
      return;
    }

    if (!nom.trim() || !dosage.trim() || !forme.trim() || !quantiteStock.trim()) {
      Alert.alert("Erreur", "Tous les champs sont requis");
      return;
    }

    const qty = parseInt(quantiteStock);
    if (qty < 10) {
      Alert.alert(
        "Stock critique",
        `La quantité est très faible (${qty}). Êtes-vous sûr de vouloir continuer ?`,
        [
          { text: "Annuler", style: "cancel" },
          { text: "Continuer", onPress: () => saveData() },
        ]
      );
      return;
    }

    saveData();
  };

  const saveData = async () => {

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateMedicament(existingMedicament.id, {
          nom: nom.trim(),
          dosage: dosage.trim(),
          forme: forme.trim(),
          quantiteStock: parseInt(quantiteStock),
        });
        Alert.alert("Succès", "Médicament mis à jour avec succès", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        const newMedicament = {
          id: `med_${Date.now()}`,
          nom: nom.trim(),
          dosage: dosage.trim(),
          forme: forme.trim(),
          quantiteStock: parseInt(quantiteStock),
        };
        await addMedicament(newMedicament);
        Alert.alert("Succès", "Médicament ajouté avec succès", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (_error) {
      Alert.alert("Erreur", "Impossible de sauvegarder le médicament");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={['#43e97b', '#38f9d7']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>
          {isEditing ? "✏️ Modifier" : "➕ Nouveau"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isEditing ? "Mettre à jour le médicament" : "Ajouter un médicament au stock"}
        </Text>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.helpBox}>
            <Ionicons name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.helpText}>
              Remplissez tous les champs avec * pour ajouter le médicament
            </Text>
          </View>

          <Input
            label="Nom du médicament *"
            value={nom}
            onChangeText={(text) => {
              setNom(text);
              if (touched.nom) validateField('nom', text);
            }}
            onBlur={() => handleBlur('nom')}
            placeholder="Ex: Doliprane, Ibuprofene..."
            error={touched.nom ? errors.nom : null}
          />

          <Input
            label="Dosage *"
            value={dosage}
            onChangeText={(text) => {
              setDosage(text);
              if (touched.dosage) validateField('dosage', text);
            }}
            onBlur={() => handleBlur('dosage')}
            placeholder="Ex: 500 mg, 1 g, 100 ml"
            error={touched.dosage ? errors.dosage : null}
          />

          <Input
            label="Forme pharmaceutique *"
            value={forme}
            onChangeText={(text) => {
              setForme(text);
              if (touched.forme) validateField('forme', text);
            }}
            onBlur={() => handleBlur('forme')}
            placeholder="Ex: Comprimé, Gélule, Sirop, Spray..."
            error={touched.forme ? errors.forme : null}
          />

          <Input
            label="Quantité en stock *"
            value={quantiteStock}
            onChangeText={(text) => {
              setQuantiteStock(text);
              if (touched.quantiteStock) validateField('quantiteStock', text);
            }}
            onBlur={() => handleBlur('quantiteStock')}
            placeholder="Nombre d'unités disponibles"
            keyboardType="numeric"
            error={touched.quantiteStock ? errors.quantiteStock : null}
          />

          {stockStatus && (
            <View style={[styles.stockAlert, { backgroundColor: stockStatus.color + '15' }]}>
              <Ionicons name={stockStatus.icon} size={24} color={stockStatus.color} />
              <View style={styles.stockAlertText}>
                <Text style={[styles.stockStatus, { color: stockStatus.color }]}>
                  {stockStatus.text}
                </Text>
                {Number(quantiteStock) < 30 && (
                  <Text style={styles.stockHint}>
                    Considérez une commande de réapprovisionnement
                  </Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={isEditing ? "Mettre à jour" : "Ajouter"}
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.submitButton}
            />
            <Button
              title="Annuler"
              variant="secondary"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  helpBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
  stockAlert: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  stockAlertText: {
    flex: 1,
  },
  stockStatus: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  stockHint: {
    fontSize: 13,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  submitButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginBottom: 0,
  },
});
