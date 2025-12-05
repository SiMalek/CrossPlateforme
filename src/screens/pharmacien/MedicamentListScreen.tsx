import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useMemo } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useMedicamentStore } from '../../store/medicamentStore';
import { colors, shadows, gradients } from '../../theme';

export default function MedicamentListScreen({ navigation }: any) {
    const { medicaments, isLoading, loadMedicaments } = useMedicamentStore();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadMedicaments();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMedicaments();
        setRefreshing(false);
    };

    const filteredMedicaments = medicaments.filter(med =>
        med.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = useMemo(() => {
        const lowStock = medicaments.filter(m => m.quantiteStock < 10).length;
        const mediumStock = medicaments.filter(m => m.quantiteStock >= 10 && m.quantiteStock < 50).length;
        const goodStock = medicaments.filter(m => m.quantiteStock >= 50).length;
        return { lowStock, mediumStock, goodStock };
    }, [medicaments]);

    const getStockColor = (stock: number) => {
        if (stock < 10) return colors.danger;
        if (stock < 50) return colors.warning;
        return colors.success;
    };

    const getStockGradient = (stock: number): string[] => {
        if (stock < 10) return ['#FEE2E2', '#FECACA'];
        if (stock < 50) return ['#FEF3C7', '#FDE68A'];
        return ['#D1FAE5', '#A7F3D0'];
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 60).duration(500).springify()}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('EditMedicament', { medicamentId: item.id })}
                activeOpacity={0.85}
            >
                <View style={[styles.cardAccent, { backgroundColor: getStockColor(item.quantiteStock) }]} />
                <View style={styles.cardBody}>
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={gradients.accent}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="medkit" size={22} color={colors.white} />
                        </LinearGradient>
                    </View>

                    <View style={styles.cardContent}>
                        <Text style={styles.medName}>{item.nom}</Text>
                        <View style={styles.medDetailsRow}>
                            <View style={styles.detailBadge}>
                                <Text style={styles.detailText}>{item.dosage}mg</Text>
                            </View>
                            <View style={styles.detailBadge}>
                                <Text style={styles.detailText}>{item.forme}</Text>
                            </View>
                        </View>
                        {item.fabricant && (
                            <Text style={styles.medFabricant}>
                                <Ionicons name="business-outline" size={10} color={colors.textTertiary} /> {item.fabricant}
                            </Text>
                        )}
                    </View>

                    <View style={styles.stockContainer}>
                        <LinearGradient
                            colors={getStockGradient(item.quantiteStock)}
                            style={styles.stockBadge}
                        >
                            <Text style={[styles.stockValue, { color: getStockColor(item.quantiteStock) }]}>
                                {item.quantiteStock}
                            </Text>
                        </LinearGradient>
                        <Text style={styles.stockLabel}>en stock</Text>
                    </View>

                    <View style={styles.chevronContainer}>
                        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Premium Header */}
            <LinearGradient
                colors={gradients.accent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <Animated.View
                    entering={FadeInUp.duration(600)}
                    style={styles.headerContent}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerSubtitle}>Inventaire</Text>
                            <Text style={styles.headerTitle}>Médicaments</Text>
                        </View>
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{medicaments.length}</Text>
                        </View>
                    </View>

                    {/* Stock Stats */}
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { borderLeftColor: colors.danger }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="warning" size={16} color={colors.danger} />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.lowStock}</Text>
                                <Text style={styles.statLabel}>Critique</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, { borderLeftColor: colors.warning }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="alert-circle" size={16} color={colors.warning} />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.mediumStock}</Text>
                                <Text style={styles.statLabel}>À surveiller</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, { borderLeftColor: colors.success }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.goodStock}</Text>
                                <Text style={styles.statLabel}>OK</Text>
                            </View>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={colors.textTertiary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Rechercher un médicament..."
                            placeholderTextColor={colors.textTertiary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                style={styles.clearButton}
                            >
                                <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                {isLoading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={styles.loadingText}>Chargement...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredMedicaments}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colors.accent]}
                                tintColor={colors.accent}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconContainer}>
                                    <LinearGradient
                                        colors={['#E0E7FF', '#C7D2FE']}
                                        style={styles.emptyIconGradient}
                                    >
                                        <Ionicons name="flask-outline" size={48} color={colors.accent} />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.emptyText}>Aucun médicament trouvé</Text>
                                <Text style={styles.emptySubtext}>
                                    {searchQuery ? 'Essayez une autre recherche' : 'Ajoutez des médicaments à votre inventaire'}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddMedicament')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={gradients.secondary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={28} color={colors.white} />
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    decorCircle2: {
        position: 'absolute',
        bottom: 10,
        left: -40,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    headerContent: {
        marginTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: -0.5,
    },
    headerBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerBadgeText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 12,
        borderLeftWidth: 3,
        gap: 8,
        ...shadows.sm,
    },
    statIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 9,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        gap: 10,
        ...shadows.lg,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
        height: '100%',
    },
    clearButton: {
        padding: 4,
    },
    contentContainer: {
        flex: 1,
        marginTop: -10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.textSecondary,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    },
    cardContainer: {
        marginBottom: 12,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 18,
        overflow: 'hidden',
        ...shadows.md,
    },
    cardAccent: {
        height: 3,
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        marginRight: 14,
    },
    iconGradient: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    medName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    medDetailsRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 4,
    },
    detailBadge: {
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    detailText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    medFabricant: {
        fontSize: 11,
        color: colors.textTertiary,
        marginTop: 2,
    },
    stockContainer: {
        alignItems: 'center',
        marginLeft: 12,
    },
    stockBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 4,
        minWidth: 44,
        alignItems: 'center',
    },
    stockValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    stockLabel: {
        fontSize: 9,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    chevronContainer: {
        marginLeft: 8,
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
    },
    emptyIconContainer: {
        marginBottom: 20,
    },
    emptyIconGradient: {
        width: 100,
        height: 100,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: Platform.OS === 'ios' ? 100 : 24,
        width: 60,
        height: 60,
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.xl,
    },
    fabGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
