import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';

const { width, height } = Dimensions.get('window');

const FloatingOrb = ({ delay, size, initialX, initialY }: { delay: number; size: number; initialX: number; initialY: number }) => {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        translateY.value = withRepeat(
            withTiming(-30, { duration: 4000 + delay, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        translateX.value = withRepeat(
            withTiming(15, { duration: 3000 + delay, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        opacity.value = withRepeat(
            withTiming(0.6, { duration: 2000 + delay }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: initialX,
                    top: initialY,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                animatedStyle,
            ]}
        />
    );
};

export default function LoginScreen() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState<'patient' | 'pharmacien'>('patient');
    const [showPassword, setShowPassword] = React.useState(false);
    const [focusedInput, setFocusedInput] = React.useState<string | null>(null);

    const { login, isLoading, error, clearError } = useAuthStore();

    useEffect(() => {
        return () => clearError();
    }, []);

    const handleLogin = async () => {
        clearError();
        const success = await login(email.trim(), password, role);
        if (success) {
            console.log('Login successful');
        }
    };

    const fillTestCredentials = (testRole: 'patient' | 'pharmacien') => {
        if (testRole === 'patient') {
            setEmail('jean@patient.fr');
            setPassword('patient123');
            setRole('patient');
        } else {
            setEmail('marie@pharmacie.fr');
            setPassword('pharmacien123');
            setRole('pharmacien');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={colors.gradientPrimary}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Floating orbs for premium effect */}
            <FloatingOrb delay={0} size={120} initialX={-30} initialY={100} />
            <FloatingOrb delay={500} size={80} initialX={width - 60} initialY={150} />
            <FloatingOrb delay={1000} size={100} initialX={width / 2 - 50} initialY={50} />
            <FloatingOrb delay={1500} size={60} initialX={40} initialY={height - 300} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(800).springify()}
                        style={styles.header}
                    >
                        <View style={styles.logoContainer}>
                            <View style={styles.logoInner}>
                                <Ionicons name="medical" size={40} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.title}>SantéConnect</Text>
                        <Text style={styles.subtitle}>Votre santé, notre priorité</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(400).duration(800).springify()}
                        style={styles.formContainer}
                    >
                        {/* Role Selection - Premium Pills */}
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    role === 'patient' && styles.roleButtonActive,
                                ]}
                                onPress={() => setRole('patient')}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.roleIconBg, role === 'patient' && styles.roleIconBgActive]}>
                                    <Ionicons
                                        name="person"
                                        size={18}
                                        color={role === 'patient' ? colors.white : colors.primary}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.roleText,
                                        role === 'patient' && styles.roleTextActive,
                                    ]}
                                >
                                    Patient
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    role === 'pharmacien' && styles.roleButtonActive,
                                ]}
                                onPress={() => setRole('pharmacien')}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.roleIconBg, role === 'pharmacien' && styles.roleIconBgActive]}>
                                    <Ionicons
                                        name="medkit"
                                        size={18}
                                        color={role === 'pharmacien' ? colors.white : colors.primary}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.roleText,
                                        role === 'pharmacien' && styles.roleTextActive,
                                    ]}
                                >
                                    Pharmacien
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Adresse email</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedInput === 'email' && styles.inputContainerFocused
                            ]}>
                                <View style={styles.inputIconContainer}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={focusedInput === 'email' ? colors.primary : colors.textTertiary}
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="votre.email@example.com"
                                    placeholderTextColor={colors.textTertiary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!isLoading}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mot de passe</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedInput === 'password' && styles.inputContainerFocused
                            ]}>
                                <View style={styles.inputIconContainer}>
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={focusedInput === 'password' ? colors.primary : colors.textTertiary}
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textTertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    editable={!isLoading}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={colors.textTertiary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Error Message */}
                        {error && (
                            <Animated.View entering={FadeInDown.duration(300)} style={styles.errorContainer}>
                                <View style={styles.errorIconContainer}>
                                    <Ionicons name="alert-circle" size={20} color={colors.danger} />
                                </View>
                                <Text style={styles.errorText}>{error}</Text>
                            </Animated.View>
                        )}

                        {/* Login Button - Premium */}
                        <TouchableOpacity
                            style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading || !email || !password}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={(!email || !password) ? [colors.textTertiary, colors.textMuted] : colors.gradientPrimary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.white} size="small" />
                                ) : (
                                    <>
                                        <Text style={styles.loginButtonText}>Se connecter</Text>
                                        <View style={styles.arrowContainer}>
                                            <Ionicons name="arrow-forward" size={20} color={colors.white} />
                                        </View>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Demo Accounts - Minimal Design */}
                        <View style={styles.demoSection}>
                            <View style={styles.demoLabelContainer}>
                                <View style={styles.demoLine} />
                                <Text style={styles.demoLabel}>Comptes de démonstration</Text>
                                <View style={styles.demoLine} />
                            </View>
                            <View style={styles.demoButtonsRow}>
                                <TouchableOpacity
                                    style={styles.demoButton}
                                    onPress={() => fillTestCredentials('patient')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="person-outline" size={16} color={colors.primary} />
                                    <Text style={styles.demoButtonText}>Patient</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.demoButton}
                                    onPress={() => fillTestCredentials('pharmacien')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="medkit-outline" size={16} color={colors.primary} />
                                    <Text style={styles.demoButtonText}>Pharmacien</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Footer branding */}
                    <Animated.View
                        entering={FadeInUp.delay(600).duration(800)}
                        style={styles.footer}
                    >
                        <Text style={styles.footerText}>Sécurisé et confidentiel</Text>
                        <View style={styles.footerIcons}>
                            <Ionicons name="shield-checkmark" size={14} color="rgba(255,255,255,0.7)" />
                            <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 8 }} />
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 88,
        height: 88,
        borderRadius: 28,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...shadows.xl,
    },
    logoInner: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: colors.primaryExtraLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    formContainer: {
        backgroundColor: colors.white,
        borderRadius: 28,
        padding: 28,
        ...shadows.xl,
    },
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundSecondary,
        padding: 6,
        borderRadius: 16,
        marginBottom: 28,
        gap: 8,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        gap: 10,
    },
    roleButtonActive: {
        backgroundColor: colors.white,
        ...shadows.md,
    },
    roleIconBg: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: colors.primaryExtraLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleIconBgActive: {
        backgroundColor: colors.primary,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    roleTextActive: {
        color: colors.textPrimary,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 10,
        marginLeft: 4,
        letterSpacing: 0.3,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    inputContainerFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.white,
    },
    inputIconContainer: {
        paddingLeft: 16,
        paddingRight: 4,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        color: colors.textPrimary,
    },
    eyeButton: {
        padding: 16,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.dangerBg,
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.danger + '20',
    },
    errorIconContainer: {
        marginRight: 12,
    },
    errorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 8,
        ...shadows.primary,
    },
    loginButtonDisabled: {
        ...shadows.sm,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        gap: 12,
    },
    loginButtonText: {
        color: colors.white,
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    arrowContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    demoSection: {
        marginTop: 28,
    },
    demoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    demoLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    demoLabel: {
        fontSize: 11,
        color: colors.textTertiary,
        marginHorizontal: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    demoButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    demoButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.primaryExtraLight,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    demoButtonText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
        fontWeight: '500',
    },
    footerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
