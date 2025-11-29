import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../common/Card";

const STATUS_LABELS = {
  en_attente: "En attente",
  en_preparation: "En préparation",
  prete: "Prête",
};

const STATUS_COLORS = {
  en_attente: "#FF9500",
  en_preparation: "#007AFF",
  prete: "#34C759",
};

export default function CommandeItem({ commande, onPress }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="receipt" size={24} color="#007AFF" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.id}>#{commande.id}</Text>
          <Text style={styles.dateText}>{formatDate(commande.dateCreation)}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[commande.status] }]}>
        <Ionicons name="time" size={14} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.statusText}>{STATUS_LABELS[commande.status]}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.seeMore}>Suivre ma commande</Text>
        <Ionicons name="chevron-forward" size={20} color="#007AFF" />
      </View>
    </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  id: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  seeMore: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 4,
  },
});
