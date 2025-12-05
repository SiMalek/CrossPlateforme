import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddMedicamentScreen from '../screens/pharmacien/AddMedicamentScreen';
import EditMedicamentScreen from '../screens/pharmacien/EditMedicamentScreen';
import MedicamentListScreen from '../screens/pharmacien/MedicamentListScreen';

const Stack = createNativeStackNavigator();

export default function MedicamentNavigator() {
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
                name="MedicamentListMain"
                component={MedicamentListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddMedicament"
                component={AddMedicamentScreen}
                options={{ title: 'Ajouter un médicament' }}
            />
            <Stack.Screen
                name="EditMedicament"
                component={EditMedicamentScreen}
                options={{ title: 'Modifier le médicament' }}
            />
        </Stack.Navigator>
    );
}
