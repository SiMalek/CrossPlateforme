import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../theme';

import OrdonnanceDetailScreen from '../screens/patient/OrdonnanceDetailScreen';
import OrdonnanceListScreen from '../screens/patient/OrdonnanceListScreen';
import CommandeFormScreen from '../screens/patient/CommandeFormScreen';

export type PatientOrdonnanceStackParamList = {
    OrdonnanceListMain: undefined;
    OrdonnanceDetail: { ordonnanceId: string };
    CommandeForm: { ordonnanceId: string };
};

const Stack = createNativeStackNavigator<PatientOrdonnanceStackParamList>();

export default function PatientOrdonnanceNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="OrdonnanceListMain"
                component={OrdonnanceListScreen}
            />
            <Stack.Screen
                name="OrdonnanceDetail"
                component={OrdonnanceDetailScreen}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: colors.white,
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name="CommandeForm"
                component={CommandeFormScreen}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: colors.white,
                    headerTitle: '',
                }}
            />
        </Stack.Navigator>
    );
}
