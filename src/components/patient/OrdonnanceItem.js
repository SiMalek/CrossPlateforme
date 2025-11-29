import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../common/Card";

export default function OrdonnanceItem({ ordonnance, onPress }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Ordonnance</Text>
          <Text style={styles.date}>{formatDate(ordonnance.date)}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Ionicons name="medical" size={18} color="#666" />
        <Text style={styles.label}>{ordonnance.medicaments?.length || 0} médicament(s) prescrit(s)</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.seeMore}>Voir les détails</Text>
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
    marginLeft: 8,
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
