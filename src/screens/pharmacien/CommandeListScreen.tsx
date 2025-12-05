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
    SafeAreaView,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { useCommandeStore } from '../../store/commandeStore';
import { colors, shadows, gradients } from '../../theme';
import { formatDateTimeShort } from '../../utils/dateUtils';
import { getUsers } from '../../api/userService';
import { User } from '../../types';

const StatusBadge = ({ status }: { status: string }) => {
    let textColor = colors.textSecondary;
    let icon = "time-outline";
    let gradientColors: string[] = ['#F3F4F6', '#E5E7EB'];

    switch (status) {
        case 'EN_ATTENTE':
            textColor = '#D97706';
            icon = "time-outline";
            gradientColors = ['#FEF3C7', '#FDE68A'];
            break;
        case 'EN_PREPARATION':
            textColor = '#2563EB';
            icon = "sync-outline";
            gradientColors = ['#DBEAFE', '#BFDBFE'];
            break;
        case 'PRETE':
            textColor = '#059669';
            icon = "checkmark-circle-outline";
            gradientColors = ['#D1FAE5', '#A7F3D0'];
            break;
        case 'RECUPEREE':
            textColor = '#4B5563';
            icon = "bag-check-outline";
            gradientColors = ['#F3F4F6', '#E5E7EB'];
            break;
        case 'RETOURNEE':
            textColor = '#DC2626';
            icon = "return-down-back-outline";
            gradientColors = ['#FEE2E2', '#FECACA'];
            break;
    }

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
        >
            <Ionicons name={icon as any} size={14} color={textColor} />
            <Text style={[styles.badgeText, { color: textColor }]}>
                {status.replace('_', ' ')}
            </Text>
        </LinearGradient>
    );
};

export default function CommandeListScreen({ navigation }: any) {
    const { currentUser } = useAuthStore();
    const { commandes, isLoading, loadCommandesByPharmacien } = useCommandeStore();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const loadData = async () => {
        if (currentUser) {
            await loadCommandesByPharmacien(currentUser.id);
            const allUsers = await getUsers();
            setUsers(allUsers);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const getPatientName = (patientId: string): string => {
        const patient = users.find(u => u.id === patientId);
        return patient ? `${patient.name} (#${patientId.slice(-4)})` : `Patient #${patientId.slice(-4)}`;
    };

    const filteredCommandes = commandes.filter(item => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        const patientName = getPatientName(item.patientId).toLowerCase();
        const commandeId = item.id.toLowerCase();
        const status = item.status.toLowerCase();

        return patientName.includes(query) ||
            commandeId.includes(query) ||
            status.includes(query);
    });

    const stats = useMemo(() => {
        const enAttente = commandes.filter(c => c.status === 'EN_ATTENTE').length;
        const enPreparation = commandes.filter(c => c.status === 'EN_PREPARATION').length;
        const pretes = commandes.filter(c => c.status === 'PRETE').length;
        return { enAttente, enPreparation, pretes, total: commandes.length };
    }, [commandes]);

    const getAccentColor = (status: string) => {
        switch (status) {
            case 'EN_ATTENTE': return '#F59E0B';
            case 'EN_PREPARATION': return '#3B82F6';
            case 'PRETE': return '#10B981';
            case 'RECUPEREE': return '#6B7280';
            case 'RETOURNEE': return '#EF4444';
            default: return colors.primary;
        }
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 80).duration(500).springify()}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CommandeDetail', { commandeId: item.id })}
            >
                <View style={[styles.cardAccent, { backgroundColor: getAccentColor(item.status) }]} />
                <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                        <View style={styles.orderInfo}>
                            <View style={styles.orderIconContainer}>
                                <LinearGradient
                                    colors={[getAccentColor(item.status), getAccentColor(item.status) + 'CC']}
                                    style={styles.orderIconGradient}
                                >
                                    <Ionicons name="receipt" size={18} color={colors.white} />
                                </LinearGradient>
                            </View>
                            <View>
                                <Text style={styles.orderLabel}>COMMANDE</Text>
                                <Text style={styles.orderId}>#{item.id.slice(-6)}</Text>
                            </View>
                        </View>
                        <StatusBadge status={item.status} />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardContent}>
                        <View style={styles.patientRow}>
                            <View style={styles.patientIcon}>
                                <Ionicons name="person" size={16} color={colors.secondary} />
                            </View>
                            <View>
                                <Text style={styles.patientLabel}>Patient</Text>
                                <Text style={styles.patientName}>{getPatientName(item.patientId)}</Text>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={styles.dateContainer}>
                                <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                                <Text style={styles.orderDate}>{formatDateTimeShort(item.dateCreation)}</Text>
                            </View>
                            <View style={styles.actionRow}>
                                <Text style={styles.actionText}>Voir détails</Text>
                                <Ionicons name="arrow-forward-circle" size={20} color={colors.primary} />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Premium Header */}
            <LinearGradient
                colors={gradients.secondary}
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
                            <Text style={styles.headerSubtitle}>Gestion</Text>
                            <Text style={styles.headerTitle}>Commandes</Text>
                        </View>
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{stats.total}</Text>
                        </View>
                    </View>

                    {/* Stats Overview */}
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="time" size={16} color="#F59E0B" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.enAttente}</Text>
                                <Text style={styles.statLabel}>Attente</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="sync" size={16} color="#3B82F6" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.enPreparation}</Text>
                                <Text style={styles.statLabel}>Préparation</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.pretes}</Text>
                                <Text style={styles.statLabel}>Prêtes</Text>
                            </View>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={colors.textTertiary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Rechercher par patient, commande, statut..."
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
                        <ActivityIndicator size="large" color={colors.secondary} />
                        <Text style={styles.loadingText}>Chargement...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredCommandes}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colors.secondary]}
                                tintColor={colors.secondary}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconContainer}>
                                    <LinearGradient
                                        colors={['#E0E7FF', '#C7D2FE']}
                                        style={styles.emptyIconGradient}
                                    >
                                        <Ionicons name="cube-outline" size={48} color={colors.secondary} />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.emptyText}>
                                    {searchQuery ? 'Aucune commande trouvée' : 'Aucune commande'}
                                </Text>
                                <Text style={styles.emptySubtext}>
                                    {searchQuery ? 'Essayez une autre recherche' : 'Les commandes des patients apparaîtront ici'}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
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
        bottom: 10,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    headerContent: {
        marginBottom: 10,
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
    searchBar: {
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
    },
    cardBody: {
        padding: 18,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    orderIconContainer: {
        // container for gradient
    },
    orderIconGradient: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.textTertiary,
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.3,
    },
    orderDate: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 5,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: 14,
    },
    cardContent: {
        gap: 14,
    },
    patientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    patientIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.secondary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    patientLabel: {
        fontSize: 10,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    patientName: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
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
