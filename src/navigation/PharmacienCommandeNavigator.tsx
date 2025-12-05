import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../theme';

import CommandeDetailScreen from '../screens/pharmacien/CommandeDetailScreen';
import CommandeListScreen from '../screens/pharmacien/CommandeListScreen';

export type PharmacienCommandeStackParamList = {
    CommandeListMain: undefined;
    CommandeDetail: { commandeId: string };
};

const Stack = createNativeStackNavigator<PharmacienCommandeStackParamList>();

export default function PharmacienCommandeNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="CommandeListMain"
                component={CommandeListScreen}
            />
            <Stack.Screen
                name="CommandeDetail"
                component={CommandeDetailScreen}
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
