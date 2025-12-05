import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useCommandeStore } from '../../store/commandeStore';
import { useMedicamentStore } from '../../store/medicamentStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { usePharmacieStore } from '../../store/pharmacieStore';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { formatDateFrenchLong, formatDateTimeShort } from '../../utils/dateUtils';
import { Pharmacie } from '../../types';

const StatusBadge = ({ status }: { status: string }) => {
    let backgroundColor = colors.backgroundSecondary;
    let textColor = colors.textSecondary;
    let icon = "time-outline";

    switch (status) {
        case 'EN_ATTENTE':
            backgroundColor = '#FEF3C7';
            textColor = '#D97706';
            icon = "time-outline";
            break;
        case 'EN_PREPARATION':
            backgroundColor = '#DBEAFE';
            textColor = '#2563EB';
            icon = "sync-outline";
            break;
        case 'PRETE':
            backgroundColor = '#D1FAE5';
            textColor = '#059669';
            icon = "checkmark-circle-outline";
            break;
        case 'RECUPEREE':
            backgroundColor = '#EDE9FE';
            textColor = '#8B5CF6';
            icon = "bag-check-outline";
            break;
        case 'RETOURNEE':
            backgroundColor = '#FEE2E2';
            textColor = '#DC2626';
            icon = "return-down-back-outline";
            break;
    }

    return (
        <View style={[styles.badge, { backgroundColor }]}>
            <Ionicons name={icon as any} size={16} color={textColor} />
            <Text style={[styles.badgeText, { color: textColor }]}>
                {status.replace('_', ' ').replace('RECUPEREE', 'RÉCUPÉRÉE').replace('RETOURNEE', 'RETOURNÉE')}
            </Text>
        </View>
    );
};

export default function PatientCommandeDetailScreen({ route, navigation }: any) {
    const { commandeId } = route.params;
    const { commandes, updateCommandeStatus, isLoading } = useCommandeStore();
    const { getOrdonnanceById } = useOrdonnanceStore();
    const { medicaments } = useMedicamentStore();
    const { pharmacies, loadPharmacies } = usePharmacieStore();

    const [commande, setCommande] = useState<any>(null);
    const [ordonnance, setOrdonnance] = useState<any>(null);
    const [medications, setMedications] = useState<any[]>([]);
    const [pharmacie, setPharmacie] = useState<Pharmacie | null>(null);

    useEffect(() => {
        loadPharmacies();
        loadCommandeDetails();
    }, [commandeId]);

    const loadCommandeDetails = async () => {
        const cmd = commandes.find(c => c.id === commandeId);
        if (cmd) {
            setCommande(cmd);
            // Find pharmacy
            const pharm = pharmacies.find(p => p.id === cmd.pharmacieId);
            setPharmacie(pharm || null);

            const ord = await getOrdonnanceById(cmd.ordonnanceId);
            if (ord) {
                setOrdonnance(ord);
                // Get medication details
                const meds = ord.medicaments?.map((m: any) => {
                    const medDetail = medicaments.find(med => med.id === m.idMedicament);
                    return {
                        ...m,
                        ...medDetail,
                    };
                }) || [];
                setMedications(meds);
            }
        }
    };

    // Update pharmacy when pharmacies load
    useEffect(() => {
        if (commande && pharmacies.length > 0) {
            const pharm = pharmacies.find(p => p.id === commande.pharmacieId);
            setPharmacie(pharm || null);
        }
    }, [pharmacies, commande]);

    const handleCall = () => {
        if (pharmacie?.telephone) {
            Linking.openURL(`tel:${pharmacie.telephone.replace(/\s/g, '')}`);
        }
    };

    const handleReturn = () => {
        Alert.alert(
            'Retourner la commande',
            'Êtes-vous sûr de vouloir retourner cette commande ? Le pharmacien devra approuver le retour.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Retourner',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await updateCommandeStatus(commandeId, 'RETOURNEE');
                            Alert.alert('Succès', 'Demande de retour envoyée au pharmacien');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de retourner la commande');
                        }
                    },
                },
            ]
        );
    };

    const canReturn = commande?.status === 'PRETE' || commande?.status === 'RECUPEREE';

    if (isLoading || !commande) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colors.gradientPrimary}
                style={styles.headerBackground}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(50)} style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="cube" size={48} color={colors.white} />
                    </View>
                    <Text style={styles.headerTitle}>Détails de la commande</Text>
                    <Text style={styles.headerSubtitle}>#{commande.id.slice(-6)}</Text>
                </Animated.View>

                <View style={styles.contentCard}>
                    <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="information-circle" size={24} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Informations</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Statut</Text>
                            <StatusBadge status={commande.status} />
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date de création</Text>
                            <Text style={styles.infoValue}>
                                {new Date(commande.dateCreation).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </Animated.View>

                    <View style={styles.divider} />

                    {/* Pharmacy Section */}
                    {pharmacie && (
                        <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="business" size={24} color={colors.secondary} />
                                <Text style={styles.sectionTitle}>Pharmacie</Text>
                            </View>

                            <View style={styles.pharmacyCard}>
                                <LinearGradient
                                    colors={[colors.secondary + '15', colors.secondary + '05']}
                                    style={styles.pharmacyCardGradient}
                                >
                                    <View style={styles.pharmacyHeader}>
                                        <View style={styles.pharmacyIconContainer}>
                                            <Ionicons name="medical" size={24} color={colors.secondary} />
                                        </View>
                                        <View style={styles.pharmacyInfo}>
                                            <Text style={styles.pharmacyName}>{pharmacie.nom}</Text>
                                            {pharmacie.note && (
                                                <View style={styles.ratingRow}>
                                                    <Ionicons name="star" size={14} color="#F59E0B" />
                                                    <Text style={styles.ratingText}>{pharmacie.note}</Text>
                                                    {pharmacie.avis && (
                                                        <Text style={styles.reviewsText}>({pharmacie.avis} avis)</Text>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.pharmacyDetails}>
                                        <View style={styles.pharmacyDetailRow}>
                                            <View style={styles.pharmacyDetailIcon}>
                                                <Ionicons name="location" size={16} color={colors.textTertiary} />
                                            </View>
                                            <Text style={styles.pharmacyDetailText}>{pharmacie.adresse}</Text>
                                        </View>
                                        <View style={styles.pharmacyDetailRow}>
                                            <View style={styles.pharmacyDetailIcon}>
                                                <Ionicons name="call" size={16} color={colors.textTertiary} />
                                            </View>
                                            <Text style={styles.pharmacyDetailText}>{pharmacie.telephone}</Text>
                                        </View>
                                    </View>

                                    {pharmacie.services && pharmacie.services.length > 0 && (
                                        <View style={styles.servicesSection}>
                                            <Text style={styles.servicesLabel}>Services disponibles</Text>
                                            <View style={styles.servicesTags}>
                                                {pharmacie.services.slice(0, 4).map((service, idx) => (
                                                    <View key={idx} style={styles.serviceTag}>
                                                        <Text style={styles.serviceTagText}>{service}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        style={styles.callButton}
                                        onPress={handleCall}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="call" size={18} color={colors.white} />
                                        <Text style={styles.callButtonText}>Appeler la pharmacie</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </Animated.View>
                    )}

                    <View style={styles.divider} />

                    <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="medical" size={24} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Médicaments</Text>
                        </View>

                        {medications.map((med, index) => (
                            <Animated.View
                                key={index}
                                entering={FadeInDown.delay(250 + index * 50)}
                                style={styles.medCard}
                            >
                                <View style={styles.medIconContainer}>
                                    <Ionicons name="medkit" size={20} color={colors.primary} />
                                </View>
                                <View style={styles.medInfo}>
                                    <Text style={styles.medName}>{med.nom || 'Médicament'}</Text>
                                    <Text style={styles.medDetails}>
                                        {med.dosage} • {med.forme}
                                    </Text>
                                    <Text style={styles.medQuantity}>
                                        {med.quantiteParJour} par jour × {med.duree} jours = {med.quantiteParJour * med.duree} unités
                                    </Text>
                                </View>
                            </Animated.View>
                        ))}
                    </Animated.View>

                    {canReturn && (
                        <Animated.View entering={FadeInDown.delay(400)} style={styles.actionSection}>
                            <TouchableOpacity
                                style={styles.returnButton}
                                onPress={handleReturn}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="return-down-back" size={24} color={colors.white} />
                                <Text style={styles.returnButtonText}>Retourner la commande</Text>
                            </TouchableOpacity>
                            <Text style={styles.returnHint}>
                                Le pharmacien devra approuver votre demande de retour
                            </Text>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220,
    },
    scrollContent: {
        paddingTop: 60,
        paddingBottom: spacing['4xl'],
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerTitle: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        fontSize: typography.fontSize.base,
        color: colors.white + 'CC',
    },
    contentCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        marginHorizontal: spacing.base,
        ...shadows.lg,
    },
    section: {
        marginBottom: spacing.base,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    infoLabel: {
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    infoValue: {
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semiBold,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    badgeText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: spacing.base,
    },
    // Pharmacy styles
    pharmacyCard: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.sm,
    },
    pharmacyCardGradient: {
        padding: spacing.base,
    },
    pharmacyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    pharmacyIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.secondary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    pharmacyInfo: {
        flex: 1,
    },
    pharmacyName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
    },
    reviewsText: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
    },
    pharmacyDetails: {
        marginBottom: spacing.md,
    },
    pharmacyDetailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    pharmacyDetailIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    pharmacyDetailText: {
        flex: 1,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
        marginTop: 4,
    },
    servicesSection: {
        marginBottom: spacing.md,
    },
    servicesLabel: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
    },
    servicesTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    serviceTag: {
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    serviceTagText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        color: colors.textSecondary,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    callButtonText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.white,
    },
    medCard: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    medIconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    medInfo: {
        flex: 1,
    },
    medName: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    medDetails: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    medQuantity: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
    },
    actionSection: {
        marginTop: spacing.lg,
    },
    returnButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.danger,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.base,
        gap: spacing.sm,
        ...shadows.md,
    },
    returnButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    returnHint: {
        fontSize: typography.fontSize.xs,
        color: colors.textTertiary,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});
