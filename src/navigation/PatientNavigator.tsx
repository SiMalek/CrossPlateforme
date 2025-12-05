import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { colors, shadows, spacing, typography } from '../theme';

import PatientCommandeNavigator from './PatientCommandeNavigator';
import PatientOrdonnanceNavigator from './PatientOrdonnanceNavigator';

export type PatientTabParamList = {
    OrdonnanceStack: undefined;
    CommandeStack: undefined;
};

const Tab = createBottomTabNavigator<PatientTabParamList>();

export default function PatientNavigator() {
    const { logout } = useAuthStore();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: colors.white,
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 88 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
                    paddingTop: 12,
                    ...shadows.lg,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
                tabBarLabelStyle: {
                    fontWeight: '600',
                    fontSize: 11,
                    marginTop: 4,
                },
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.primary,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                    letterSpacing: 0.3,
                },
                headerTitleAlign: 'center',
                headerRight: () => (
                    <TouchableOpacity
                        onPress={logout}
                        style={styles.logoutButton}
                        activeOpacity={0.7}
                    >
                        <View style={styles.logoutButtonInner}>
                            <Ionicons name="log-out-outline" size={22} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                ),
            }}
        >
            <Tab.Screen
                name="OrdonnanceStack"
                component={PatientOrdonnanceNavigator}
                options={{
                    title: 'Mes Ordonnances',
                    tabBarLabel: 'Ordonnances',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
                            <Ionicons
                                name={focused ? "document-text" : "document-text-outline"}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="CommandeStack"
                component={PatientCommandeNavigator}
                options={{
                    title: 'Mes Commandes',
                    tabBarLabel: 'Commandes',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
                            <Ionicons
                                name={focused ? "cube" : "cube-outline"}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        marginRight: 16,
    },
    logoutButtonInner: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 32,
        borderRadius: 16,
    },
    tabIconContainerActive: {
        backgroundColor: colors.primary + '15',
    },
});
