import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useCommandeStore } from '../../store/commandeStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { useMedicamentStore } from '../../store/medicamentStore';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { formatDateFrenchLong, formatDateTimeShort } from '../../utils/dateUtils';
import { getUsers } from '../../api/userService';
import { User } from '../../types';

const StatusOption = ({
    status,
    currentStatus,
    onSelect,
    label,
    icon
}: {
    status: string,
    currentStatus: string,
    onSelect: (s: string) => void,
    label: string,
    icon: string
}) => {
    const isSelected = status === currentStatus;

    return (
        <TouchableOpacity
            style={[
                styles.statusOption,
                isSelected && styles.statusOptionSelected
            ]}
            onPress={() => onSelect(status)}
        >
            <View style={[
                styles.statusIconContainer,
                isSelected && styles.statusIconContainerSelected
            ]}>
                <Ionicons
                    name={icon as any}
                    size={20}
                    color={isSelected ? colors.white : colors.textSecondary}
                />
            </View>
            <Text style={[
                styles.statusLabel,
                isSelected && styles.statusLabelSelected
            ]}>
                {label}
            </Text>
            {isSelected && (
                <View style={styles.checkIcon}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function CommandeDetailScreen({ route, navigation }: any) {
    const { commandeId } = route.params;
    const { commandes, updateCommandeStatus, isLoading } = useCommandeStore();
    const { ordonnances } = useOrdonnanceStore();
    const { medicaments: allMedicaments } = useMedicamentStore();

    const commande = commandes.find(c => c.id === commandeId);
    const ordonnance = commande ? ordonnances.find(o => o.id === commande.ordonnanceId) : null;

    const [selectedStatus, setSelectedStatus] = useState(commande?.status || 'EN_ATTENTE');
    const [preparedMeds, setPreparedMeds] = useState<Record<string, boolean>>(commande?.preparedMedicaments || {});
    const [patientName, setPatientName] = useState<string>('');

    useEffect(() => {
        loadPatientName();
    }, [commande]);

    const loadPatientName = async () => {
        if (commande) {
            const users = await getUsers();
            const patient = users.find(u => u.id === commande.patientId);
            if (patient) {
                setPatientName(`${patient.name} (#${commande.patientId.slice(-4)})`);
            } else {
                setPatientName(`Patient #${commande.patientId.slice(-4)}`);
            }
        }
    };

    if (!commande) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Commande non trouvée</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleToggleMedPrepared = (medId: string) => {
        setPreparedMeds(prev => ({
            ...prev,
            [medId]: !prev[medId]
        }));
    };

    const allMedsPrepared = ordonnance?.medicaments.every(
        med => preparedMeds[med.idMedicament]
    ) || false;

    const handleUpdateStatus = async () => {
        // If trying to set to PRETE, ensure all meds are prepared
        if (selectedStatus === 'PRETE' && !allMedsPrepared) {
            Alert.alert(
                'Attention',
                'Veuillez marquer tous les médicaments comme préparés avant de mettre la commande en statut "Prête".'
            );
            return;
        }

        Alert.alert(
            "Mettre à jour le statut",
            `Voulez-vous changer le statut en "${selectedStatus.replace('_', ' ')}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Confirmer",
                    onPress: async () => {
                        await updateCommandeStatus(commande.id, selectedStatus as any, preparedMeds);
                        Alert.alert("Succès", "Statut mis à jour avec succès");
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const getMedicamentName = (medId: string): string => {
        const med = allMedicaments.find(m => m.id === medId);
        return med ? med.nom : `Médicament ${medId}`;
    };

    const getMedicamentDetails = (medId: string): string => {
        const med = allMedicaments.find(m => m.id === medId);
        return med ? `${med.dosage}mg - ${med.forme}` : '';
    };

    const medicaments = ordonnance?.medicaments || [];

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
                            <Text style={styles.label}>Commande N°</Text>
                            <Text style={styles.title}>{commande.id.slice(-6)}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                            <Text style={styles.dateText}>
                                {formatDateTimeShort(commande.dateCreation)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.patientRow}>
                        <View style={styles.patientIcon}>
                            <Ionicons name="person" size={20} color={colors.white} />
                        </View>
                        <View style={styles.patientInfo}>
                            <Text style={styles.patientLabel}>Patient</Text>
                            <Text style={styles.patientName}>{patientName}</Text>
                        </View>
                    </View>

                    {commande.lieuLivraison && (
                        <View style={styles.deliveryRow}>
                            <Ionicons name="location" size={16} color={colors.textSecondary} />
                            <View style={styles.deliveryInfo}>
                                <Text style={styles.deliveryLabel}>Livraison</Text>
                                <Text style={styles.deliveryAddress}>{commande.lieuLivraison}</Text>
                            </View>
                        </View>
                    )}

                    {commande.remarques && (
                        <View style={styles.remarksRow}>
                            <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                            <View style={styles.remarksInfo}>
                                <Text style={styles.remarksLabel}>Remarques</Text>
                                <Text style={styles.remarksText}>{commande.remarques}</Text>
                            </View>
                        </View>
                    )}
                </Animated.View>

                {/* Status Selection */}
                <Text style={styles.sectionTitle}>Mettre à jour le statut</Text>
                <Animated.View entering={FadeInDown.delay(200)} style={styles.statusContainer}>
                    <StatusOption
                        status="EN_ATTENTE"
                        currentStatus={selectedStatus}
                        onSelect={setSelectedStatus}
                        label="En attente"
                        icon="time-outline"
                    />
                    <StatusOption
                        status="EN_PREPARATION"
                        currentStatus={selectedStatus}
                        onSelect={setSelectedStatus}
                        label="En préparation"
                        icon="sync-outline"
                    />
                    <StatusOption
                        status="PRETE"
                        currentStatus={selectedStatus}
                        onSelect={setSelectedStatus}
                        label="Prête"
                        icon="checkmark-circle-outline"
                    />
                    <StatusOption
                        status="RECUPEREE"
                        currentStatus={selectedStatus}
                        onSelect={setSelectedStatus}
                        label="Récupérée"
                        icon="bag-check-outline"
                    />
                    <StatusOption
                        status="RETOURNEE"
                        currentStatus={selectedStatus}
                        onSelect={setSelectedStatus}
                        label="Retournée"
                        icon="return-down-back-outline"
                    />
                </Animated.View>

                {/* Medications List */}
                <Text style={styles.sectionTitle}>
                    Médicaments à préparer
                    {medicaments.length > 0 && (
                        <Text style={styles.medCount}>
                            {' '}({Object.keys(preparedMeds).filter(k => preparedMeds[k]).length}/{medicaments.length} préparés)
                        </Text>
                    )}
                </Text>

                {medicaments.length > 0 ? (
                    medicaments.map((med, index) => {
                        const isPrepared = preparedMeds[med.idMedicament] || false;
                        const totalQuantity = med.quantiteParJour * med.duree;

                        return (
                            <Animated.View
                                key={index}
                                entering={FadeInDown.delay(300 + (index * 100))}
                                style={styles.medCard}
                            >
                                {/* Checkbox to mark as prepared/found */}
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => handleToggleMedPrepared(med.idMedicament)}
                                >
                                    <View style={[styles.checkbox, isPrepared && styles.checkboxChecked]}>
                                        {isPrepared && (
                                            <Ionicons name="checkmark" size={20} color={colors.white} />
                                        )}
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.medIcon}>
                                    <Ionicons name="medkit-outline" size={24} color={isPrepared ? colors.success : colors.secondary} />
                                </View>

                                <View style={styles.medContent}>
                                    <Text style={[styles.medName, isPrepared && styles.medNamePrepared]}>
                                        {getMedicamentName(med.idMedicament)}
                                    </Text>
                                    <Text style={styles.medSubtitle}>
                                        {getMedicamentDetails(med.idMedicament)}
                                    </Text>
                                    <View style={styles.medDetails}>
                                        <View style={styles.badge}>
                                            <Ionicons name="cube-outline" size={12} color={colors.textSecondary} />
                                            <Text style={styles.badgeText}>Total: {totalQuantity} unités</Text>
                                        </View>
                                        <View style={styles.badge}>
                                            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                                            <Text style={styles.badgeText}>{med.duree} jours</Text>
                                        </View>
                                    </View>
                                </View>

                                {isPrepared && (
                                    <View style={styles.preparedBadge}>
                                        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                                    </View>
                                )}
                            </Animated.View>
                        );
                    })
                ) : (
                    <View style={styles.emptyMedContainer}>
                        <Ionicons name="information-circle-outline" size={48} color={colors.textTertiary} />
                        <Text style={styles.noMedText}>Aucun médicament dans cette commande.</Text>
                        <Text style={styles.noMedSubtext}>La prescription associée ne contient pas de médicaments.</Text>
                    </View>
                )}

                {/* Action Button */}
                <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, selectedStatus === commande.status && styles.buttonDisabled]}
                        onPress={handleUpdateStatus}
                        activeOpacity={0.8}
                        disabled={selectedStatus === commande.status || isLoading}
                    >
                        <LinearGradient
                            colors={selectedStatus === commande.status ? [colors.textTertiary, colors.textTertiary] : colors.gradientPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Ionicons name="save-outline" size={24} color={colors.white} />
                            <Text style={styles.buttonText}>
                                {isLoading ? "Mise à jour..." : "Enregistrer le statut"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
    patientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    patientIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    patientInfo: {
        flex: 1,
    },
    patientLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    patientName: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        gap: spacing.sm,
    },
    deliveryInfo: {
        flex: 1,
    },
    deliveryLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    deliveryAddress: {
        fontSize: typography.fontSize.sm,
        color: colors.textPrimary,
    },
    remarksRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        backgroundColor: colors.primary + '08',
        borderRadius: borderRadius.md,
        gap: spacing.sm,
    },
    remarksInfo: {
        flex: 1,
    },
    remarksLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    remarksText: {
        fontSize: typography.fontSize.sm,
        color: colors.textPrimary,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        marginLeft: spacing.xs,
    },
    medCount: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.normal,
        color: colors.textSecondary,
    },
    statusContainer: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        marginBottom: spacing.xl,
        ...shadows.sm,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: 4,
    },
    statusOptionSelected: {
        backgroundColor: colors.primary + '10',
    },
    statusIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    statusIconContainerSelected: {
        backgroundColor: colors.primary,
    },
    statusLabel: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    statusLabelSelected: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    checkIcon: {
        marginLeft: spacing.sm,
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
    checkboxContainer: {
        marginRight: spacing.sm,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
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
        marginBottom: 2,
    },
    medNamePrepared: {
        color: colors.success,
    },
    medSubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    medDetails: {
        flexDirection: 'row',
        gap: spacing.sm,
        flexWrap: 'wrap',
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
    preparedBadge: {
        marginLeft: spacing.xs,
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
    buttonDisabled: {
        opacity: 0.7,
        elevation: 0,
        shadowOpacity: 0,
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
    emptyMedContainer: {
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.lg,
        marginVertical: spacing.md,
    },
    noMedText: {
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semiBold,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    noMedSubtext: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
});
