import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { useCommandeStore } from '../../store/commandeStore';
import { usePharmacieStore } from '../../store/pharmacieStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { useMedicamentStore } from '../../store/medicamentStore';
import { colors, shadows, gradients } from '../../theme';
import { getLocalDateTimeISO } from '../../utils/dateUtils';

export default function CommandeFormScreen({ route, navigation }: any) {
    const { ordonnanceId } = route.params;
    const { currentUser } = useAuthStore();
    const { addCommande, isLoading: isCreatingCommande } = useCommandeStore();
    const { pharmacies, loadPharmacies, isLoading: isLoadingPharmacies } = usePharmacieStore();
    const { ordonnances } = useOrdonnanceStore();
    const { medicaments: allMedicaments } = useMedicamentStore();

    const ordonnance = ordonnances.find(o => o.id === ordonnanceId);

    const [selectedPharmacieId, setSelectedPharmacieId] = useState<string>('');
    const [lieuLivraison, setLieuLivraison] = useState<string>('');
    const [remarques, setRemarques] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadPharmacies();
    }, [loadPharmacies]); const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedPharmacieId) {
            newErrors.pharmacie = 'Veuillez sélectionner une pharmacie';
        }
        if (!lieuLivraison.trim()) {
            newErrors.lieuLivraison = 'Le lieu de livraison est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm() || !currentUser) return;

        try {
            const newCommande = {
                id: `cmd_${Date.now()}`,
                ordonnanceId,
                patientId: currentUser.id,
                pharmacieId: selectedPharmacieId, // Changed from pharmacienId to pharmacieId
                status: 'EN_ATTENTE' as const,
                dateCreation: getLocalDateTimeISO(), // Uses local date/time automatically
                lieuLivraison: lieuLivraison.trim(),
                remarques: remarques.trim(),
            };

            await addCommande(newCommande);
            Alert.alert('Succès', 'Votre commande a été créée avec succès !', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('CommandeStack'),
                },
            ]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Impossible de créer la commande';
            Alert.alert('Erreur', errorMessage);
        }
    };

    if (isLoadingPharmacies) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingIconContainer}>                    <LinearGradient
                    colors={gradients.primary}
                    style={styles.loadingIconGradient}
                >
                    <ActivityIndicator size="large" color={colors.white} />
                </LinearGradient>
                </View>
                <Text style={styles.loadingText}>Chargement des pharmacies...</Text>
                <Text style={styles.loadingSubtext}>Veuillez patienter</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Premium Header */}
            <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerBackground}
            >
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInUp.duration(600)} style={styles.headerCard}>
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={gradients.primary}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="cart" size={28} color={colors.white} />
                        </LinearGradient>
                    </View>
                    <Text style={styles.title}>Nouvelle Commande</Text>
                    <Text style={styles.subtitle}>
                        Sélectionnez une pharmacie et renseignez les informations de livraison
                    </Text>
                </Animated.View>

                {/* Pharmacy Selection */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name="business" size={16} color={colors.primary} />
                        </View>
                        <Text style={styles.sectionTitle}>
                            Choix de la pharmacie <Text style={styles.required}>*</Text>
                        </Text>
                    </View>
                    {pharmacies.map((pharmacie, index) => (
                        <Animated.View
                            key={pharmacie.id}
                            entering={FadeInDown.delay(150 + index * 50).duration(400)}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.pharmacieCard,
                                    selectedPharmacieId === pharmacie.id && styles.pharmacieCardSelected,
                                ]}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setSelectedPharmacieId(pharmacie.id);
                                    if (errors.pharmacie) {
                                        setErrors({ ...errors, pharmacie: '' });
                                    }
                                }}
                            >
                                {/* Selection indicator */}
                                <View style={[
                                    styles.selectionIndicator,
                                    selectedPharmacieId === pharmacie.id && styles.selectionIndicatorActive
                                ]} />

                                <View style={styles.pharmacieContent}>
                                    {/* Header with name and rating */}
                                    <View style={styles.pharmacieHeader}>
                                        <View style={styles.pharmacieNameContainer}>
                                            <View style={[
                                                styles.pharmacieIconBg,
                                                selectedPharmacieId === pharmacie.id && styles.pharmacieIconBgActive
                                            ]}>
                                                <Ionicons
                                                    name="medical"
                                                    size={18}
                                                    color={selectedPharmacieId === pharmacie.id ? colors.white : colors.primary}
                                                />
                                            </View>
                                            <View style={styles.pharmacieNameWrapper}>
                                                <Text style={[
                                                    styles.pharmacieName,
                                                    selectedPharmacieId === pharmacie.id && styles.pharmacieNameSelected
                                                ]}>{pharmacie.nom}</Text>
                                                {pharmacie.note && (
                                                    <View style={styles.ratingContainer}>
                                                        <Ionicons name="star" size={12} color="#F59E0B" />
                                                        <Text style={styles.ratingText}>{pharmacie.note}</Text>
                                                        {pharmacie.avis && (
                                                            <Text style={styles.reviewsText}>({pharmacie.avis} avis)</Text>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        {selectedPharmacieId === pharmacie.id && (
                                            <View style={styles.checkmarkContainer}>
                                                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                                            </View>
                                        )}
                                    </View>

                                    {/* Address and Phone */}
                                    <View style={styles.pharmacieDetails}>
                                        <View style={styles.pharmacieDetailRow}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
                                            </View>
                                            <Text style={styles.pharmacieAddress} numberOfLines={2}>{pharmacie.adresse}</Text>
                                        </View>
                                        <View style={styles.pharmacieDetailRow}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="call-outline" size={14} color={colors.textTertiary} />
                                            </View>
                                            <Text style={styles.pharmaciePhone}>{pharmacie.telephone}</Text>
                                        </View>
                                    </View>

                                    {/* Services tags */}
                                    {pharmacie.services && pharmacie.services.length > 0 && (
                                        <View style={styles.servicesContainer}>
                                            {pharmacie.services.slice(0, 3).map((service, idx) => (
                                                <View key={idx} style={styles.serviceTag}>
                                                    <Text style={styles.serviceTagText}>{service}</Text>
                                                </View>
                                            ))}
                                            {pharmacie.services.length > 3 && (
                                                <View style={[styles.serviceTag, styles.moreServicesTag]}>
                                                    <Text style={styles.moreServicesText}>+{pharmacie.services.length - 3}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                    {errors.pharmacie && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={14} color={colors.danger} />
                            <Text style={styles.errorText}>{errors.pharmacie}</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Delivery Location */}
                <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name="location" size={16} color={colors.secondary} />
                        </View>
                        <Text style={styles.sectionTitle}>
                            Lieu de livraison <Text style={styles.required}>*</Text>
                        </Text>
                    </View>
                    <View style={[styles.inputWrapper, errors.lieuLivraison && styles.inputError]}>
                        <View style={styles.inputIconContainer}>
                            <Ionicons
                                name="navigate"
                                size={18}
                                color={errors.lieuLivraison ? colors.danger : colors.textTertiary}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 10 rue des Lilas, 75001 Paris"
                            placeholderTextColor={colors.textTertiary}
                            value={lieuLivraison}
                            onChangeText={(text) => {
                                setLieuLivraison(text);
                                if (errors.lieuLivraison) {
                                    setErrors({ ...errors, lieuLivraison: '' });
                                }
                            }}
                            multiline
                        />
                    </View>
                    {errors.lieuLivraison && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={14} color={colors.danger} />
                            <Text style={styles.errorText}>{errors.lieuLivraison}</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Remarks */}
                <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIconContainer, { backgroundColor: colors.accent + '20' }]}>
                            <Ionicons name="chatbubble-ellipses" size={16} color={colors.accent} />
                        </View>
                        <Text style={styles.sectionTitle}>Remarques</Text>
                        <View style={styles.optionalBadge}>
                            <Text style={styles.optionalText}>Optionnel</Text>
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIconContainer}>
                            <Ionicons
                                name="create-outline"
                                size={18}
                                color={colors.textTertiary}
                            />
                        </View>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ex: Livraison avant 18h, Appeler avant de venir..."
                            placeholderTextColor={colors.textTertiary}
                            value={remarques}
                            onChangeText={setRemarques}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </Animated.View>

                {/* Medications Summary with Stock Status */}
                {ordonnance && ordonnance.medicaments && ordonnance.medicaments.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIconContainer, { backgroundColor: colors.info + '20' }]}>
                                <Ionicons name="medical" size={16} color={colors.info} />
                            </View>
                            <Text style={styles.sectionTitle}>Médicaments prescrits</Text>
                        </View>
                        {ordonnance.medicaments.map((med, index) => {
                            const medicament = allMedicaments.find(m => m.id === med.idMedicament);
                            const totalNeeded = med.quantiteParJour * med.duree;
                            const inStock = medicament && medicament.quantiteStock >= totalNeeded;
                            
                            return (
                                <View key={index} style={styles.medCard}>
                                    <View style={[styles.medIconContainer, !inStock && styles.medIconContainerWarning]}>
                                        <Ionicons 
                                            name={inStock ? "checkmark-circle" : "alert-circle"} 
                                            size={20} 
                                            color={inStock ? colors.success : colors.warning} 
                                        />
                                    </View>
                                    <View style={styles.medInfo}>
                                        <Text style={styles.medName}>{medicament?.nom || 'Médicament inconnu'}</Text>
                                        <Text style={styles.medDetails}>
                                            {medicament?.dosage} - {medicament?.forme}
                                        </Text>
                                        <View style={styles.medStockInfo}>
                                            <Text style={[styles.medStock, !inStock && styles.medStockWarning]}>
                                                {inStock 
                                                    ? `✓ En stock (${medicament?.quantiteStock} disponibles)` 
                                                    : `⚠ Stock insuffisant (${medicament?.quantiteStock || 0}/${totalNeeded} disponibles)`
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </Animated.View>
                )}

                {/* Submit Button */}
                <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, isCreatingCommande && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        activeOpacity={0.85}
                        disabled={isCreatingCommande}
                    >
                        <LinearGradient
                            colors={isCreatingCommande ? ['#A5B4FC', '#C4B5FD'] : gradients.secondary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            {isCreatingCommande ? (
                                <>
                                    <ActivityIndicator color={colors.white} size="small" />
                                    <Text style={styles.buttonText}>Création en cours...</Text>
                                </>
                            ) : (
                                <>
                                    <View style={styles.buttonIconContainer}>
                                        <Ionicons name="checkmark-circle" size={22} color={colors.white} />
                                    </View>
                                    <Text style={styles.buttonText}>Créer la commande</Text>
                                    <Ionicons name="arrow-forward" size={18} color={colors.white} style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                        disabled={isCreatingCommande}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cancelButtonContent}>
                            <Ionicons name="close-circle-outline" size={18} color={colors.textSecondary} />
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    loadingIconContainer: {
        marginBottom: 20,
    },
    loadingIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    loadingSubtext: {
        fontSize: 14,
        color: colors.textTertiary,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    decorCircle2: {
        position: 'absolute',
        bottom: 20,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 70 : 50,
        paddingBottom: 40,
    },
    headerCard: {
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 28,
        marginBottom: 24,
        alignItems: 'center',
        ...shadows.lg,
    },
    iconContainer: {
        marginBottom: 16,
    },
    iconGradient: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sectionTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    required: {
        color: colors.danger,
    },
    optionalBadge: {
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    optionalText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    pharmacieCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        marginBottom: 14,
        borderWidth: 2,
        borderColor: colors.border,
        overflow: 'hidden',
        ...shadows.sm,
    },
    pharmacieCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.white,
        ...shadows.md,
    },
    selectionIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    selectionIndicatorActive: {
        backgroundColor: colors.primary,
    },
    pharmacieContent: {
        padding: 18,
    },
    pharmacieHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    pharmacieNameContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    pharmacieIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    pharmacieIconBgActive: {
        backgroundColor: colors.primary,
    },
    pharmacieNameWrapper: {
        flex: 1,
    },
    pharmacieName: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    pharmacieNameSelected: {
        color: colors.primary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    reviewsText: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    checkmarkContainer: {
        marginLeft: 8,
    },
    pharmacieDetails: {
        marginBottom: 12,
    },
    pharmacieDetailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
    },
    detailIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    pharmacieAddress: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    pharmaciePhone: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    serviceTag: {
        backgroundColor: colors.primary + '12',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    serviceTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
    moreServicesTag: {
        backgroundColor: colors.backgroundSecondary,
    },
    moreServicesText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textTertiary,
    },
    pharmacieInfo: {
        flex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: colors.border,
        ...shadows.sm,
    },
    inputError: {
        borderColor: colors.danger,
        backgroundColor: colors.danger + '05',
    },
    inputIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        minHeight: 36,
        lineHeight: 22,
    },
    textArea: {
        minHeight: 70,
        textAlignVertical: 'top',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 4,
        gap: 6,
    },
    errorText: {
        fontSize: 13,
        color: colors.danger,
        fontWeight: '500',
    },
    medCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    medIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.success + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    medIconContainerWarning: {
        backgroundColor: colors.warning + '15',
    },
    medInfo: {
        flex: 1,
    },
    medName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    medDetails: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    medStockInfo: {
        marginTop: 2,
    },
    medStock: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.success,
    },
    medStockWarning: {
        color: colors.warning,
    },
    footer: {
        marginTop: 16,
        marginBottom: 20,
    },
    button: {
        borderRadius: 18,
        overflow: 'hidden',
        ...shadows.lg,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
    },
    buttonIconContainer: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.3,
    },
    cancelButton: {
        marginTop: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});
