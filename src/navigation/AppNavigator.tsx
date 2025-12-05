import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme';
import { initializeSeedData } from '../utils/seedData';

import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import PharmacienNavigator from './PharmacienNavigator';

export default function AppNavigator() {
    const { currentUser, isAuthenticated, isLoading, loadSession } = useAuthStore();
    const [isInitialized, setIsInitialized] = React.useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                // Initialize seed data on first launch
                await initializeSeedData();

                // Load saved session
                await loadSession();

                setIsInitialized(true);
            } catch (error) {
                console.error('Initialization error:', error);
                setIsInitialized(true);
            }
        };

        initialize();
    }, [loadSession]);

    // Show loading screen while initializing
    if (!isInitialized || isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Determine which navigator to show based on authentication and role
    const getNavigator = () => {
        if (!isAuthenticated || !currentUser) {
            return <AuthNavigator />;
        }

        switch (currentUser.role) {
            case 'patient':
                return <PatientNavigator />;
            case 'pharmacien':
                return <PharmacienNavigator />;
            default:
                return <AuthNavigator />;
        }
    };

    return getNavigator();
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});
