import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CommandeListScreen from '../screens/patient/CommandeListScreen';
import PatientCommandeDetailScreen from '../screens/patient/PatientCommandeDetailScreen';

const Stack = createNativeStackNavigator();

export default function PatientCommandeNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#3B82F6',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="CommandeListMain"
                component={CommandeListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PatientCommandeDetail"
                component={PatientCommandeDetailScreen}
                options={{ title: 'Détails de la commande' }}
            />
        </Stack.Navigator>
    );
}
