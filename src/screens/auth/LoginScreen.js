import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation for icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, slideAnim, scaleAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      Alert.alert("Erreur", error || "Email ou mot de passe incorrect");
    }
  };

  const handleDemoLogin = async (role) => {
    const demoAccounts = {
      patient: { email: "patient@test.com", password: "patient123" },
      pharmacien: { email: "pharmacien@test.com", password: "pharma123" },
    };

    const account = demoAccounts[role];
    setEmail(account.email);
    setPassword(account.password);
    
    // Auto login immediately
    const success = await login(account.email, account.password);
    if (!success) {
      Alert.alert("Erreur", "Échec de la connexion démo. Veuillez réessayer.");
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Animated Icon */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { rotate: spin }],
                },
              ]}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="medical" size={64} color="#fff" />
              </View>
            </Animated.View>

            {/* Animated Title */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Text style={styles.title}>MediScript</Text>
              <Text style={styles.subtitle}>Gestion d&apos;Ordonnances Médicales</Text>
            </Animated.View>

            {/* Form Card */}
            <Animated.View
              style={[
                styles.formCard,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.form}>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="exemple@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Input
                  label="Mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Votre mot de passe"
                  secureTextEntry
                />

                <Button
                  title="Se connecter"
                  onPress={handleLogin}
                  loading={isLoading}
                  style={styles.button}
                />
              </View>

              {/* Demo Login Section */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>ou essayez en démo</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.demoButtons}>
                <TouchableOpacity
                  style={[styles.demoButton, styles.patientDemo]}
                  onPress={() => handleDemoLogin('patient')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.demoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="person" size={28} color="#fff" />
                    <View style={styles.demoTextContainer}>
                      <Text style={styles.demoTitle}>Patient</Text>
                      <Text style={styles.demoSubtitle}>Voir mes ordonnances</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoButton, styles.pharmacienDemo]}
                  onPress={() => handleDemoLogin('pharmacien')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#43e97b', '#38f9d7']}
                    style={styles.demoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="medkit" size={28} color="#fff" />
                    <View style={styles.demoTextContainer}>
                      <Text style={styles.demoTitle}>Pharmacien</Text>
                      <Text style={styles.demoSubtitle}>Gérer les commandes</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View
              style={{
                opacity: fadeAnim,
              }}
            >
              <Text style={styles.footer}>Développé pour l&apos;excellence académique</Text>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 60,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 24,
  },
  form: {
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  demoButtons: {
    gap: 16,
  },
  demoButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  demoGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  demoTextContainer: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  demoSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  footer: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 16,
  },
});
