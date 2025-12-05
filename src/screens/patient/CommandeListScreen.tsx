import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useMemo } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    SafeAreaView,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { useCommandeStore } from '../../store/commandeStore';
import { usePharmacieStore } from '../../store/pharmacieStore';
import { colors, shadows, gradients } from '../../theme';
import { formatDateTimeShort } from '../../utils/dateUtils';
import { Commande } from '../../types';

const StatusBadge = ({ status }: { status: string }) => {
    let backgroundColor = colors.backgroundSecondary;
    let textColor = colors.textSecondary;
    let icon = "time-outline";
    let gradientColors: string[] = ['#F3F4F6', '#E5E7EB'];

    switch (status) {
        case 'EN_ATTENTE':
            backgroundColor = '#FEF3C7';
            textColor = '#D97706';
            icon = "time-outline";
            gradientColors = ['#FEF3C7', '#FDE68A'];
            break;
        case 'EN_PREPARATION':
            backgroundColor = '#DBEAFE';
            textColor = '#2563EB';
            icon = "sync-outline";
            gradientColors = ['#DBEAFE', '#BFDBFE'];
            break;
        case 'PRETE':
            backgroundColor = '#D1FAE5';
            textColor = '#059669';
            icon = "checkmark-circle-outline";
            gradientColors = ['#D1FAE5', '#A7F3D0'];
            break;
        case 'RECUPEREE':
            backgroundColor = '#F3F4F6';
            textColor = '#4B5563';
            icon = "bag-check-outline";
            gradientColors = ['#F3F4F6', '#E5E7EB'];
            break;
        case 'RETOURNEE':
            backgroundColor = '#FEE2E2';
            textColor = '#DC2626';
            icon = "return-down-back-outline";
            gradientColors = ['#FEE2E2', '#FECACA'];
            break;
    }

    return (
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
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
        </Animated.View>
    );
};

export default function CommandeListScreen({ navigation }: any) {
    const { currentUser } = useAuthStore();
    const { commandes, isLoading, loadCommandesByPatient } = useCommandeStore();
    const { pharmacies, loadPharmacies } = usePharmacieStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (currentUser) {
            loadCommandesByPatient(currentUser.id);
            loadPharmacies();
        }
    }, [currentUser]);

    const onRefresh = async () => {
        if (currentUser) {
            setRefreshing(true);
            await loadCommandesByPatient(currentUser.id);
            await loadPharmacies();
            setRefreshing(false);
        }
    };

    const getPharmacyName = (pharmacieId: string): string => {
        const pharmacie = pharmacies.find(p => p.id === pharmacieId);
        return pharmacie ? pharmacie.nom : 'Pharmacie inconnue';
    };

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

    const renderItem = ({ item, index }: { item: Commande, index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 80).duration(500).springify()}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('PatientCommandeDetail', { commandeId: item.id })}
            >
                <View style={[styles.cardAccent, { backgroundColor: getAccentColor(item.status) }]} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={styles.orderInfo}>
                            <View style={styles.iconContainer}>
                                <LinearGradient
                                    colors={[getAccentColor(item.status), getAccentColor(item.status) + 'CC']}
                                    style={styles.iconGradient}
                                >
                                    <Ionicons name="cart" size={20} color={colors.white} />
                                </LinearGradient>
                            </View>
                            <View style={styles.orderDetails}>
                                <Text style={styles.orderLabel}>COMMANDE</Text>
                                <Text style={styles.orderId}>#{item.id.slice(-6)}</Text>
                            </View>
                        </View>
                        <StatusBadge status={item.status} />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardBody}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="business-outline" size={16} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Pharmacie</Text>
                                    <Text style={styles.infoValue}>{getPharmacyName(item.pharmacieId)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={styles.dateContainer}>
                                <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                                <Text style={styles.dateText}>{formatDateTimeShort(item.dateCreation)}</Text>
                            </View>
                            <View style={styles.medCountBadge}>
                                <Ionicons name="medical" size={12} color={colors.secondary} />
                                <Text style={styles.medCountText}>
                                    {item.medicaments?.length || 0} médicament{(item.medicaments?.length || 0) > 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.chevronContainer}>
                        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Premium Header */}
            <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                {/* Decorative Circles */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <Animated.View
                    entering={FadeInUp.duration(600)}
                    style={styles.headerContent}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.welcomeText}>Mes Commandes</Text>
                            <Text style={styles.headerTitle}>Suivi en temps réel</Text>
                        </View>
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{stats.total}</Text>
                        </View>
                    </View>

                    {/* Stats Overview */}
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="time" size={18} color="#F59E0B" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.enAttente}</Text>
                                <Text style={styles.statLabel}>En attente</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="sync" size={18} color="#3B82F6" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.enPreparation}</Text>
                                <Text style={styles.statLabel}>Préparation</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{stats.pretes}</Text>
                                <Text style={styles.statLabel}>Prêtes</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                {isLoading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Chargement...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={commandes}
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
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconContainer}>
                                    <LinearGradient
                                        colors={['#E0E7FF', '#C7D2FE']}
                                        style={styles.emptyIconGradient}
                                    >
                                        <Ionicons name="cube-outline" size={48} color={colors.primary} />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.emptyText}>Aucune commande</Text>
                                <Text style={styles.emptySubtext}>
                                    Vos commandes en cours apparaîtront ici.{'\n'}Créez votre première commande !
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
        paddingBottom: 30,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -20,
        left: -20,
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
        marginBottom: 20,
    },
    welcomeText: {
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
        borderRadius: 20,
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
        gap: 10,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 14,
        borderLeftWidth: 3,
        gap: 8,
        ...shadows.sm,
    },
    statIconContainer: {
        width: 32,
        height: 32,
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
        fontSize: 10,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
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
    cardContent: {
        padding: 18,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginRight: 12,
    },
    iconGradient: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderDetails: {
        flex: 1,
    },
    orderLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textTertiary,
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    orderId: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -0.3,
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
    cardBody: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 10,
    },
    infoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        color: colors.textTertiary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
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
    dateText: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    medCountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary + '15',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 5,
    },
    medCountText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.secondary,
    },
    chevronContainer: {
        position: 'absolute',
        right: 16,
        top: '50%',
        marginTop: 8,
        width: 32,
        height: 32,
        borderRadius: 10,
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
});
