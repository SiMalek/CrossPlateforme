import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { seedDatabase } from "./src/data/seedData";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // FORCE RE-SEED: Clear old data and seed fresh
      console.log("Force re-seeding database...");
      await seedDatabase();
      console.log("Database initialized successfully");
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing app:", error);
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
