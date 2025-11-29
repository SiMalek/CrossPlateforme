import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CommandeCreateScreen from "../screens/patient/CommandeCreateScreen";
import CommandeDetailScreen from "../screens/patient/CommandeDetailScreen";
import CommandeListScreen from "../screens/patient/CommandeListScreen";
import OrdonnanceDetailScreen from "../screens/patient/OrdonnanceDetailScreen";
import OrdonnanceListScreen from "../screens/patient/OrdonnanceListScreen";

const Tab = createBottomTabNavigator();
const OrdonnanceStack = createNativeStackNavigator();
const CommandeStack = createNativeStackNavigator();

function OrdonnanceStackNavigator() {
  return (
    <OrdonnanceStack.Navigator>
      <OrdonnanceStack.Screen
        name="OrdonnanceList"
        component={OrdonnanceListScreen}
        options={{ headerShown: false }}
      />
      <OrdonnanceStack.Screen
        name="OrdonnanceDetail"
        component={OrdonnanceDetailScreen}
        options={{ title: "Détail de l'ordonnance" }}
      />
      <OrdonnanceStack.Screen
        name="CommandeCreate"
        component={CommandeCreateScreen}
        options={{ title: "Créer une commande" }}
      />
    </OrdonnanceStack.Navigator>
  );
}

function CommandeStackNavigator() {
  return (
    <CommandeStack.Navigator>
      <CommandeStack.Screen
        name="CommandeListMain"
        component={CommandeListScreen}
        options={{ headerShown: false }}
      />
      <CommandeStack.Screen
        name="CommandeDetail"
        component={CommandeDetailScreen}
        options={{ title: "Détail de la commande" }}
      />
    </CommandeStack.Navigator>
  );
}

export default function PatientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Ordonnances") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "Commandes") {
            iconName = focused ? "cart" : "cart-outline";
          }

          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Ordonnances" component={OrdonnanceStackNavigator} />
      <Tab.Screen name="Commandes" component={CommandeStackNavigator} />
    </Tab.Navigator>
  );
}
