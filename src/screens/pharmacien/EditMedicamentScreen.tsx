import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
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
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useMedicamentStore } from '../../store/medicamentStore';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';

// Preset manufacturers
const MANUFACTURERS = ['Sanofi', 'Pfizer', 'Generic', 'GSK', 'Merck', 'Teva', 'UPSA', 'Biogaran', 'Sandoz', 'Ipsen'];

// Forme options
const FORMES = ['Comprimé', 'Gélule', 'Sirop', 'Poudre', 'Inhalateur', 'Crème', 'Injectable', 'Gouttes'];

export default function EditMedicamentScreen({ route, navigation }: any) {
    const { medicamentId } = route.params;
    const { medicaments, updateMedicament, deleteMedicament, isLoading } = useMedicamentStore();
    const medicament = medicaments.find(m => m.id === medicamentId);

    const [formData, setFormData] = useState({
        nom: medicament?.nom || '',
        dosage: parseInt(medicament?.dosage || '500'),
        forme: medicament?.forme || 'Comprimé',
        quantiteStock: medicament?.quantiteStock || 0,
        fabricant: medicament?.fabricant || 'Sanofi',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showFabricantDropdown, setShowFabricantDropdown] = useState(false);
    const [showFormeDropdown, setShowFormeDropdown] = useState(false);

    useEffect(() => {
        if (!medicament) {
            Alert.alert('Erreur', 'Médicament introuvable');
            navigation.goBack();
        }
    }, [medicament]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        
        // Check for duplicate names (case-insensitive), excluding current medicament
        const duplicateName = medicaments.find(
            m => m.id !== medicamentId && m.nom.toLowerCase() === formData.nom.trim().toLowerCase()
        );
        if (duplicateName) {
            newErrors.nom = 'Un médicament avec ce nom existe déjà';
        }
        
        if (formData.dosage < 1) newErrors.dosage = 'Le dosage doit être supérieur à 0';
        if (!formData.forme.trim()) newErrors.forme = 'La forme est requise';
        if (formData.quantiteStock < 0) {
            newErrors.quantiteStock = 'La quantité ne peut pas être négative';
        }
        if (!formData.fabricant.trim()) newErrors.fabricant = 'Le fabricant est requis';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm() || !medicament) {
            Alert.alert('Erreur de validation', 'Veuillez remplir tous les champs obligatoires correctement.');
            return;
        }

        try {
            await updateMedicament(medicament.id, {
                nom: formData.nom.trim(),
                dosage: formData.dosage.toString(),
                forme: formData.forme,
                quantiteStock: formData.quantiteStock,
                fabricant: formData.fabricant,
            });
            Alert.alert('Succès', 'Médicament mis à jour avec succès');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour le médicament');
        }
    };

    const handleDelete = () => {
        if (!medicament) return;

        Alert.alert(
            'Supprimer le médicament',
            `Êtes-vous sûr de vouloir supprimer "${medicament.nom}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMedicament(medicament.id);
                            Alert.alert('Succès', 'Médicament supprimé');
                            navigation.goBack();
                        } catch (error) {
                            const errorMessage = error instanceof Error ? error.message : 'Impossible de supprimer le médicament';
                            Alert.alert('Erreur', errorMessage);
                        }
                    },
                },
            ]
        );
    };

    const incrementStock = () => {
        setFormData({ ...formData, quantiteStock: formData.quantiteStock + 10 });
    };

    const decrementStock = () => {
        if (formData.quantiteStock >= 10) {
            setFormData({ ...formData, quantiteStock: formData.quantiteStock - 10 });
        }
    };

    if (!medicament) return null;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient
                colors={colors.gradientPrimary}
                style={styles.headerBackground}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View entering={FadeInDown.delay(50)} style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="create" size={48} color={colors.white} />
                    </View>
                    <Text style={styles.headerTitle}>Modifier Médicament</Text>
                    <Text style={styles.headerSubtitle}>Mettez à jour les informations du médicament</Text>
                </Animated.View>

                <View style={styles.formCard}>
                    {/* Nom du médicament */}
                    <Animated.View entering={FadeInDown.delay(100)} style={styles.inputContainer}>
                        <Text style={styles.label}>Nom du médicament *</Text>
                        <View style={[styles.inputWrapper, errors.nom && styles.inputError]}>
                            <Ionicons name="medical" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Doliprane"
                                placeholderTextColor={colors.textTertiary}
                                value={formData.nom}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, nom: text });
                                    if (errors.nom) setErrors({ ...errors, nom: '' });
                                }}
                            />
                        </View>
                        {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
                    </Animated.View>

                    {/* Dosage with Slider */}
                    <Animated.View entering={FadeInDown.delay(200)} style={styles.inputContainer}>
                        <Text style={styles.label}>Dosage (mg) *</Text>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderHeader}>
                                <Ionicons name="flask" size={20} color={colors.primary} />
                                <Text style={styles.sliderValue}>{formData.dosage} mg</Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={10}
                                maximumValue={2000}
                                step={10}
                                value={formData.dosage}
                                onValueChange={(value) => setFormData({ ...formData, dosage: Math.round(value) })}
                                minimumTrackTintColor={colors.primary}
                                maximumTrackTintColor={colors.border}
                                thumbTintColor={colors.primary}
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>10 mg</Text>
                                <Text style={styles.sliderLabel}>2000 mg</Text>
                            </View>
                        </View>
                        {errors.dosage && <Text style={styles.errorText}>{errors.dosage}</Text>}
                    </Animated.View>

                    {/* Forme with Dropdown */}
                    <Animated.View entering={FadeInDown.delay(300)} style={styles.inputContainer}>
                        <Text style={styles.label}>Forme *</Text>
                        <TouchableOpacity
                            style={[styles.dropdownButton, errors.forme && styles.inputError]}
                            onPress={() => setShowFormeDropdown(!showFormeDropdown)}
                        >
                            <Ionicons name="cube" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                            <Text style={styles.dropdownText}>{formData.forme || 'Sélectionner une forme'}</Text>
                            <Ionicons
                                name={showFormeDropdown ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={colors.textTertiary}
                            />
                        </TouchableOpacity>
                        {showFormeDropdown && (
                            <View style={styles.dropdown}>
                                {FORMES.map((forme) => (
                                    <TouchableOpacity
                                        key={forme}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, forme });
                                            setShowFormeDropdown(false);
                                            if (errors.forme) setErrors({ ...errors, forme: '' });
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{forme}</Text>
                                        {formData.forme === forme && (
                                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {errors.forme && <Text style={styles.errorText}>{errors.forme}</Text>}
                    </Animated.View>

                    {/* Quantité Stock with +/- Buttons and TextInput */}
                    <Animated.View entering={FadeInDown.delay(400)} style={styles.inputContainer}>
                        <Text style={styles.label}>Quantité en stock *</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.quantityButton} onPress={decrementStock}>
                                <Ionicons name="remove-circle" size={36} color={colors.primary} />
                            </TouchableOpacity>
                            <View style={styles.quantityInputContainer}>
                                <Ionicons name="layers" size={20} color={colors.textTertiary} style={{ marginRight: spacing.xs }} />
                                <TextInput
                                    style={styles.quantityInputField}
                                    value={formData.quantiteStock.toString()}
                                    onChangeText={(text) => {
                                        const num = parseInt(text) || 0;
                                        setFormData({ ...formData, quantiteStock: num >= 0 ? num : 0 });
                                    }}
                                    keyboardType="number-pad"
                                    placeholder="0"
                                    placeholderTextColor={colors.textTertiary}
                                />
                            </View>
                            <TouchableOpacity style={styles.quantityButton} onPress={incrementStock}>
                                <Ionicons name="add-circle" size={36} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        {errors.quantiteStock && <Text style={styles.errorText}>{errors.quantiteStock}</Text>}
                    </Animated.View>

                    {/* Fabricant with Dropdown */}
                    <Animated.View entering={FadeInDown.delay(500)} style={styles.inputContainer}>
                        <Text style={styles.label}>Fabricant *</Text>
                        <TouchableOpacity
                            style={[styles.dropdownButton, errors.fabricant && styles.inputError]}
                            onPress={() => setShowFabricantDropdown(!showFabricantDropdown)}
                        >
                            <Ionicons name="business" size={20} color={colors.textTertiary} style={styles.inputIcon} />
                            <Text style={styles.dropdownText}>{formData.fabricant || 'Sélectionner un fabricant'}</Text>
                            <Ionicons
                                name={showFabricantDropdown ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={colors.textTertiary}
                            />
                        </TouchableOpacity>
                        {showFabricantDropdown && (
                            <View style={styles.dropdown}>
                                {MANUFACTURERS.map((manufacturer) => (
                                    <TouchableOpacity
                                        key={manufacturer}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, fabricant: manufacturer });
                                            setShowFabricantDropdown(false);
                                            if (errors.fabricant) setErrors({ ...errors, fabricant: '' });
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{manufacturer}</Text>
                                        {formData.fabricant === manufacturer && (
                                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {errors.fabricant && <Text style={styles.errorText}>{errors.fabricant}</Text>}
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="trash" size={20} color={colors.white} />
                            <Text style={styles.deleteButtonText}>Supprimer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={colors.gradientPrimary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitButtonGradient}
                            >
                                <Ionicons name="checkmark-circle" size={24} color={colors.white} />
                                <Text style={styles.submitButtonText}>
                                    {isLoading ? 'Mise à jour...' : 'Enregistrer'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        marginHorizontal: spacing.base,
        ...shadows.lg,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: 'transparent',
        paddingHorizontal: spacing.md,
        height: 56,
    },
    inputError: {
        borderColor: colors.danger,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
        height: '100%',
    },
    errorText: {
        fontSize: typography.fontSize.xs,
        color: colors.danger,
        marginTop: spacing.xs,
        marginLeft: spacing.xs,
    },
    sliderContainer: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    sliderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        gap: spacing.sm,
    },
    sliderValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -spacing.xs,
    },
    sliderLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: 'transparent',
        paddingHorizontal: spacing.md,
        height: 56,
    },
    dropdownText: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
    },
    dropdown: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        marginTop: spacing.xs,
        ...shadows.md,
        maxHeight: 200,
        overflow: 'scroll',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dropdownItemText: {
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    quantityButton: {
        padding: spacing.xs,
    },
    quantityInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        ...shadows.sm,
        flex: 1,
        marginHorizontal: spacing.sm,
    },
    quantityInputField: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        flex: 1,
        textAlign: 'center',
        minWidth: 60,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    deleteButton: {
        flex: 1,
        height: 56,
        borderRadius: borderRadius.full,
        backgroundColor: colors.danger,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
        ...shadows.md,
    },
    deleteButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    submitButton: {
        flex: 1,
        height: 56,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        ...shadows.md,
    },
    submitButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    submitButtonText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
});
