import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { useCommandeStore } from '../../store/commandeStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { useMedicamentStore } from '../../store/medicamentStore';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { getUsers } from '../../api/userService';
import { User } from '../../types';

export default function OrdonnanceDetailScreen({ route, navigation }: any) {
    const { ordonnanceId } = route.params;
    const { ordonnances } = useOrdonnanceStore();
    const { addCommande, isLoading } = useCommandeStore();
    const { currentUser } = useAuthStore();
    const { medicaments: allMedicaments, loadMedicaments } = useMedicamentStore();
    const [medecinName, setMedecinName] = useState<string>('');

    const ordonnance = ordonnances.find(o => o.id === ordonnanceId);

    useEffect(() => {
        loadMedicaments();
        loadMedecinName();
    }, [ordonnance]);

    const loadMedecinName = async () => {
        if (ordonnance) {
            const users = await getUsers();
            const medecin = users.find(u => u.id === ordonnance.medecinId);
            setMedecinName(medecin ? medecin.name : 'Médecin inconnu');
        }
    };

    const getMedicamentName = (medId: string): string => {
        const med = allMedicaments.find(m => m.id === medId);
        return med ? med.nom : `Médicament supprimé`;
    };

    // Check if any medication in the ordonnance no longer exists
    const hasMissingMedications = ordonnance?.medicaments.some(
        med => !allMedicaments.find(m => m.id === med.idMedicament)
    ) || false;

    // Check if any medication has insufficient stock
    const hasInsufficientStock = ordonnance?.medicaments.some(med => {
        const medicament = allMedicaments.find(m => m.id === med.idMedicament);
        if (!medicament) return false;
        const totalQuantity = med.quantiteParJour * med.duree;
        return medicament.quantiteStock < totalQuantity;
    }) || false;

    if (!ordonnance) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Ordonnance non trouvée</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Check if ordonnance is expired
    const isExpired = new Date(ordonnance.dateExpiration) < new Date();

    // Determine if order can be created
    const canCreateOrder = !ordonnance.isUsed && !isExpired && !hasMissingMedications && !hasInsufficientStock;

    const handleCreateCommande = async () => {
        if (!currentUser) return;

        if (ordonnance.isUsed) {
            Alert.alert('Erreur', 'Cette ordonnance a déjà été utilisée pour une commande.');
            return;
        }

        if (isExpired) {
            Alert.alert('Erreur', 'Cette ordonnance a expiré et ne peut plus être utilisée.');
            return;
        }

        if (hasMissingMedications) {
            Alert.alert('Erreur', 'Un ou plusieurs médicaments de cette ordonnance ne sont plus disponibles.');
            return;
        }

        if (hasInsufficientStock) {
            Alert.alert('Erreur', 'Stock insuffisant pour un ou plusieurs médicaments de cette ordonnance.');
            return;
        }

        // Navigate to the order form screen instead of creating directly
        navigation.navigate('CommandeForm', { ordonnanceId: ordonnance.id });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.headerBackground}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Card */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.headerCard}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.label}>Ordonnance N°</Text>
                            <Text style={styles.title}>{ordonnance.id}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                            <Text style={styles.dateText}>
                                {new Date(ordonnance.date).toLocaleDateString('fr-FR')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.doctorRow}>
                        <View style={styles.doctorIcon}>
                            <Ionicons name="person" size={20} color={colors.white} />
                        </View>
                        <View>
                            <Text style={styles.doctorLabel}>Prescrit par</Text>
                            <Text style={styles.doctorName}>{medecinName}</Text>
                        </View>
                    </View>

                    {/* Expiration info */}
                    <View style={[styles.expirationRow, isExpired && styles.expiredRow]}>
                        <Ionicons
                            name={isExpired ? "alert-circle" : "time-outline"}
                            size={16}
                            color={isExpired ? colors.danger : colors.textSecondary}
                        />
                        <Text style={[styles.expirationText, isExpired && styles.expiredText]}>
                            {isExpired
                                ? 'Ordonnance expirée'
                                : `Expire le ${new Date(ordonnance.dateExpiration).toLocaleDateString('fr-FR')}`
                            }
                        </Text>
                    </View>
                </Animated.View>

                {/* Medications List */}
                <Text style={styles.sectionTitle}>Médicaments prescrits</Text>

                {ordonnance.medicaments.map((med, index) => {
                    const medicament = allMedicaments.find(m => m.id === med.idMedicament);
                    const isMissing = !medicament;
                    const totalNeeded = med.quantiteParJour * med.duree;
                    const isLowStock = medicament && medicament.quantiteStock < totalNeeded;

                    return (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(200 + (index * 100))}
                            style={[styles.medCard, (isMissing || isLowStock) && { borderLeftWidth: 3, borderLeftColor: colors.danger }]}
                        >
                            <View style={[styles.medIcon, (isMissing || isLowStock) && { backgroundColor: colors.danger + '15' }]}>
                                <Ionicons
                                    name={isMissing ? "alert-circle-outline" : "medkit-outline"}
                                    size={24}
                                    color={isMissing || isLowStock ? colors.danger : colors.secondary}
                                />
                            </View>
                            <View style={styles.medContent}>
                                <Text style={[styles.medName, isMissing && { color: colors.danger }]}>
                                    {getMedicamentName(med.idMedicament)}
                                </Text>
                                {isMissing && (
                                    <Text style={{ color: colors.danger, fontSize: 12, marginBottom: 4 }}>
                                        ⚠️ Ce médicament n'est plus disponible
                                    </Text>
                                )}
                                {isLowStock && !isMissing && (
                                    <Text style={{ color: colors.danger, fontSize: 12, marginBottom: 4 }}>
                                        ⚠️ Stock insuffisant (disponible: {medicament.quantiteStock}, besoin: {totalNeeded})
                                    </Text>
                                )}
                                <View style={styles.medDetails}>
                                    <View style={styles.badge}>
                                        <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                                        <Text style={styles.badgeText}>{med.duree} jours</Text>
                                    </View>
                                    <View style={styles.badge}>
                                        <Ionicons name="repeat-outline" size={12} color={colors.textSecondary} />
                                        <Text style={styles.badgeText}>{med.quantiteParJour} / jour</Text>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    );
                })}

                {/* Action Button */}
                <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
                    {!canCreateOrder ? (
                        <View style={styles.disabledButton}>
                            <Ionicons name="close-circle" size={24} color={colors.textTertiary} />
                            <Text style={styles.disabledButtonText}>
                                {ordonnance.isUsed
                                    ? 'Déjà commandée'
                                    : isExpired
                                        ? 'Ordonnance expirée'
                                        : hasMissingMedications
                                            ? 'Médicaments indisponibles'
                                            : 'Stock insuffisant'}
                            </Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleCreateCommande}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={colors.gradientSecondary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Ionicons name="cart" size={24} color={colors.white} />
                                <Text style={styles.buttonText}>
                                    {isLoading ? "Création en cours..." : "Commander maintenant"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: typography.fontSize.lg,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    backText: {
        color: colors.primary,
        fontSize: typography.fontSize.base,
    },
    scrollContent: {
        padding: spacing.base,
        paddingTop: spacing.xl,
    },
    headerCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        ...shadows.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    dateText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    doctorIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    doctorLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    doctorName: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        marginLeft: spacing.xs,
    },
    medCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    medIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.secondary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    medContent: {
        flex: 1,
    },
    medName: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    medDetails: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
        gap: 4,
    },
    badgeText: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    footer: {
        marginTop: spacing.xl,
        marginBottom: spacing['4xl'],
    },
    button: {
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        ...shadows.lg,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.sm,
    },
    buttonText: {
        color: colors.white,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
    },
    disabledButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.sm,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.full,
    },
    disabledButtonText: {
        color: colors.textTertiary,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
    },
    expirationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: spacing.xs,
    },
    expiredRow: {
        backgroundColor: colors.danger + '10',
        marginTop: spacing.md,
        marginHorizontal: -spacing.lg,
        marginBottom: -spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.danger + '20',
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
    },
    expirationText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    expiredText: {
        color: colors.danger,
        fontWeight: typography.fontWeight.medium,
    },
});
