import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';
import { getUsers } from '../../api/userService';
import { User, Ordonnance } from '../../types';

const { width } = Dimensions.get('window');

const StatCard = ({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon as any} size={18} color={color} />
        </View>
        <View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    </View>
);

export default function OrdonnanceListScreen({ navigation }: any) {
    const { currentUser } = useAuthStore();
    const { ordonnances, isLoading, loadOrdonnancesByPatient } = useOrdonnanceStore();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (currentUser) {
            loadOrdonnancesByPatient(currentUser.id);
            loadUsers();
        }
    }, [currentUser]);

    const loadUsers = async () => {
        const allUsers = await getUsers();
        setUsers(allUsers);
    };

    const onRefresh = async () => {
        if (currentUser) {
            setRefreshing(true);
            await loadOrdonnancesByPatient(currentUser.id);
            await loadUsers();
            setRefreshing(false);
        }
    };

    const getMedecinName = (medecinId: string): string => {
        const medecin = users.find(u => u.id === medecinId && u.role === 'medecin');
        return medecin ? medecin.name : 'Médecin inconnu';
    };

    // Filter out used and expired ordonnances, then apply search
    const filteredOrdonnances = ordonnances
        .filter(ord => !ord.isUsed && new Date(ord.dateExpiration) > new Date())
        .filter(ord =>
            ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            new Date(ord.date).toLocaleDateString('fr-FR').includes(searchQuery)
        );

    const renderItem = ({ item, index }: { item: Ordonnance, index: number }) => {
        const daysUntilExpiry = Math.ceil((new Date(item.dateExpiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const isExpiringSoon = daysUntilExpiry <= 14;

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 80).springify()}
                layout={Layout.springify()}
                style={styles.cardContainer}
            >
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('OrdonnanceDetail', { ordonnanceId: item.id })}
                >
                    {/* Accent Line */}
                    <View style={styles.cardAccent} />

                    <View style={styles.cardContent}>
                        {/* Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={styles.iconContainer}>
                                    <LinearGradient
                                        colors={colors.gradientPrimary}
                                        style={styles.iconGradient}
                                    >
                                        <Ionicons name="document-text" size={22} color={colors.white} />
                                    </LinearGradient>
                                </View>
                                <View style={styles.headerText}>
                                    <Text style={styles.cardTitle}>Ordonnance</Text>
                                    <Text style={styles.cardId}>#{item.id.slice(-6).toUpperCase()}</Text>
                                </View>
                            </View>
                            <View style={styles.chevronContainer}>
                                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                            </View>
                        </View>

                        {/* Date info */}
                        <View style={styles.dateRow}>
                            <View style={styles.dateItem}>
                                <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                                <Text style={styles.dateLabel}>Créée le</Text>
                                <Text style={styles.dateValue}>
                                    {new Date(item.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </View>
                            <View style={[styles.expiryBadge, isExpiringSoon && styles.expiryBadgeWarning]}>
                                <Ionicons
                                    name={isExpiringSoon ? "warning" : "time-outline"}
                                    size={12}
                                    color={isExpiringSoon ? colors.warning : colors.textSecondary}
                                />
                                <Text style={[styles.expiryText, isExpiringSoon && styles.expiryTextWarning]}>
                                    {daysUntilExpiry}j restants
                                </Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <View style={[styles.statDot, { backgroundColor: colors.primary }]} />
                                <Text style={styles.statNumber}>{item.medicaments.length}</Text>
                                <Text style={styles.statText}>médicament{item.medicaments.length > 1 ? 's' : ''}</Text>
                            </View>
                            <View style={styles.statSeparator} />
                            <View style={styles.statItem}>
                                <View style={[styles.statDot, { backgroundColor: colors.secondary }]} />
                                <Text style={styles.statNumber}>{getMedecinName(item.medecinId).split(' ')[0]}</Text>
                                <Text style={styles.statText}>{getMedecinName(item.medecinId).split(' ').slice(1).join(' ')}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Premium Header Background */}
            <LinearGradient
                colors={colors.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerBackground}
            />

            {/* Header Content */}
            <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.headerContent}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.welcomeText}>Bonjour 👋</Text>
                        <Text style={styles.headerTitle}>Mes Ordonnances</Text>
                    </View>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>{filteredOrdonnances.length}</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher une ordonnance..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>

            {/* Content */}
            <View style={styles.contentContainer}>
                {isLoading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Chargement...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredOrdonnances}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                                progressViewOffset={20}
                            />
                        }
                        ListEmptyComponent={
                            <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyContainer}>
                                <View style={styles.emptyIconContainer}>
                                    <LinearGradient
                                        colors={[colors.backgroundSecondary, colors.backgroundTertiary]}
                                        style={styles.emptyIconGradient}
                                    >
                                        <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.emptyText}>Aucune ordonnance</Text>
                                <Text style={styles.emptySubtext}>
                                    {searchQuery
                                        ? "Aucun résultat pour cette recherche"
                                        : "Vos ordonnances actives apparaîtront ici"}
                                </Text>
                            </Animated.View>
                        }
                    />
                )}
            </View>
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
        left: 0,
        right: 0,
        top: 0,
        height: 220,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: -0.5,
    },
    headerBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerBadgeText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        ...shadows.lg,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: colors.textPrimary,
    },
    contentContainer: {
        flex: 1,
        marginTop: -20,
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
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    },
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.md,
    },
    cardAccent: {
        height: 4,
        backgroundColor: colors.primary,
    },
    cardContent: {
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardHeaderLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
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
    headerText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 13,
        color: colors.textTertiary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    cardId: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.3,
    },
    chevronContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateLabel: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    dateValue: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    expiryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    expiryBadgeWarning: {
        backgroundColor: colors.warningBg,
    },
    expiryText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    expiryTextWarning: {
        color: colors.warning,
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statNumber: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    statSeparator: {
        width: 1,
        height: 24,
        backgroundColor: colors.divider,
        marginHorizontal: 16,
    },
    // Stat Cards (for header stats if needed)
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 3,
        gap: 10,
        ...shadows.sm,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 11,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
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
});
