# 📚 Guide Complet du Projet "Santé Connect" - Tout ce que tu dois savoir

> **Note importante**: Ce guide est écrit spécialement pour toi qui débutes en React Native. Chaque concept est expliqué simplement, étape par étape. Tu pourras répondre à TOUTES les questions de ton professeur après avoir lu ce document !

---

## 📋 Table des Matières

1. [C'est quoi ce projet ?](#1-cest-quoi-ce-projet-)
2. [Les Technologies Utilisées](#2-les-technologies-utilisées)
3. [L'Architecture du Projet](#3-larchitecture-du-projet)
4. [Comment fonctionne React Native ?](#4-comment-fonctionne-react-native-)
5. [Le Système de Navigation](#5-le-système-de-navigation)
6. [La Gestion de l'État avec Zustand](#6-la-gestion-de-létat-avec-zustand)
7. [Les Services API](#7-les-services-api)
8. [Le Stockage des Données](#8-le-stockage-des-données)
9. [Les Types TypeScript](#9-les-types-typescript)
10. [Le Système de Thème](#10-le-système-de-thème)
11. [Les Hooks React](#11-les-hooks-react)
12. [Les Composants et Écrans](#12-les-composants-et-écrans)
13. [Le Flux d'Authentification](#13-le-flux-dauthentification)
14. [Questions Fréquentes du Professeur](#14-questions-fréquentes-du-professeur)
15. [Les Règles Métier et Validations](#15-les-règles-métier-et-validations-)
16. [Diagrammes de Flux de Données](#16-diagrammes-de-flux-de-données-)
17. [Guide de Démarrage Rapide](#17-guide-de-démarrage-rapide-)

---

## 1. C'est quoi ce projet ? 🏥

### Description Simple
C'est une application mobile de **gestion d'ordonnances médicales**. Elle connecte les **patients** avec les **pharmaciens**.

### Ce que fait l'application

**Pour les Patients :**
- Voir leurs ordonnances (prescriptions du médecin)
- Commander des médicaments à partir d'une ordonnance
- Suivre l'état de leurs commandes (en attente, en préparation, prête, récupérée)

**Pour les Pharmaciens :**
- Gérer l'inventaire des médicaments (ajouter, modifier, supprimer)
- Traiter les commandes des patients
- Mettre à jour le stock

### Les Comptes de Test
```
Patient:
- Email: jean@patient.fr
- Mot de passe: patient123

Pharmacien:
- Email: marie@pharmacie.fr
- Mot de passe: pharmacien123
```

---

## 2. Les Technologies Utilisées

### React Native
**C'est quoi ?** Un framework (outil) créé par Facebook qui permet de créer des applications mobiles pour iOS ET Android avec le même code JavaScript/TypeScript.

**Pourquoi c'est bien ?**
- Un seul code pour deux plateformes (au lieu d'écrire en Swift pour iOS et Kotlin pour Android)
- Utilise JavaScript que beaucoup de développeurs connaissent déjà
- Performances proches des apps natives

### Expo
**C'est quoi ?** Un ensemble d'outils qui simplifie le développement React Native.

**Pourquoi on l'utilise ?**
- Pas besoin d'installer Android Studio ou Xcode pour commencer
- On peut tester l'app sur notre téléphone avec l'app "Expo Go"
- Beaucoup de fonctionnalités prêtes à l'emploi (caméra, stockage, etc.)

### TypeScript
**C'est quoi ?** C'est JavaScript avec des "types". Ça veut dire qu'on définit à l'avance le format des données.

**Exemple simple :**
```typescript
// En JavaScript simple (pas de types)
let nom = "Jean";
nom = 123; // Ça marche mais c'est une erreur logique !

// En TypeScript (avec types)
let nom: string = "Jean";
nom = 123; // ERREUR ! TypeScript te prévient
```

**Pourquoi c'est utile ?**
- Détecte les erreurs AVANT que l'app soit lancée
- Aide l'éditeur à proposer des suggestions
- Le code est plus facile à comprendre

### Zustand
**C'est quoi ?** Une bibliothèque pour gérer l'état (les données) de l'application.

**Pourquoi on l'utilise ?** (voir section 6 pour les détails)
- Plus simple que Redux (une autre solution populaire)
- Léger et rapide
- Facile à apprendre

### AsyncStorage
**C'est quoi ?** Un système de stockage de données sur le téléphone, similaire au localStorage sur le web.

---

## 3. L'Architecture du Projet

### Structure des Dossiers Expliquée

```
ProjetReactCross-main/
│
├── app/                      # 📱 Point d'entrée de l'application Expo
│   ├── _layout.tsx          # Layout principal (structure de base)
│   └── (tabs)/              # Les onglets (pas utilisés ici, on a notre propre navigation)
│
├── src/                      # 📂 CODE SOURCE PRINCIPAL
│   │
│   ├── api/                  # 🔌 COUCHE DE DONNÉES (communication avec le stockage)
│   │   ├── asyncStorage.ts   # Fonctions génériques de stockage
│   │   ├── userService.ts    # Gestion des utilisateurs
│   │   ├── ordonnanceService.ts  # Gestion des ordonnances
│   │   ├── commandeService.ts    # Gestion des commandes
│   │   ├── medicamentService.ts  # Gestion des médicaments
│   │   └── pharmacieService.ts   # Gestion des pharmacies
│   │
│   ├── store/                # 🏪 GESTION DE L'ÉTAT (Zustand stores)
│   │   ├── authStore.ts      # État de l'authentification
│   │   ├── ordonnanceStore.ts    # État des ordonnances
│   │   ├── commandeStore.ts      # État des commandes
│   │   └── medicamentStore.ts    # État des médicaments
│   │
│   ├── navigation/           # 🧭 NAVIGATION (comment on se déplace dans l'app)
│   │   ├── AppNavigator.tsx      # Navigateur principal (décide quel écran montrer)
│   │   ├── AuthNavigator.tsx     # Navigation pour la connexion
│   │   ├── PatientNavigator.tsx  # Navigation avec onglets pour le patient
│   │   ├── PharmacienNavigator.tsx   # Navigation avec onglets pour le pharmacien
│   │   └── ... (autres navigateurs)
│   │
│   ├── screens/              # 📺 LES ÉCRANS (ce que l'utilisateur voit)
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx   # Écran de connexion
│   │   ├── patient/
│   │   │   ├── OrdonnanceListScreen.tsx      # Liste des ordonnances
│   │   │   ├── OrdonnanceDetailScreen.tsx    # Détail d'une ordonnance
│   │   │   ├── CommandeListScreen.tsx        # Liste des commandes
│   │   │   └── CommandeFormScreen.tsx        # Formulaire de commande
│   │   └── pharmacien/
│   │       ├── MedicamentListScreen.tsx      # Liste des médicaments
│   │       ├── AddMedicamentScreen.tsx       # Ajouter un médicament
│   │       └── EditMedicamentScreen.tsx      # Modifier un médicament
│   │
│   ├── types/                # 📋 DÉFINITIONS DES TYPES TypeScript
│   │   ├── user.types.ts     # Types pour les utilisateurs
│   │   ├── ordonnance.types.ts   # Types pour les ordonnances
│   │   ├── commande.types.ts     # Types pour les commandes
│   │   └── medicament.types.ts   # Types pour les médicaments
│   │
│   ├── theme/                # 🎨 STYLE ET DESIGN
│   │   ├── colors.ts         # Couleurs de l'application
│   │   ├── spacing.ts        # Espacements standards
│   │   └── typography.ts     # Styles de texte
│   │
│   └── utils/                # 🔧 UTILITAIRES
│       └── seedData.ts       # Données de test pré-remplies
│
└── package.json              # 📦 Liste des dépendances et scripts
```

### C'est quoi cette "Architecture en Couches" ?

Imagine l'application comme un gâteau avec plusieurs étages :

```
┌─────────────────────────────────────────┐
│            ÉCRANS (screens/)            │  ← Ce que l'utilisateur VOIT
│   (Boutons, textes, formulaires...)     │
├─────────────────────────────────────────┤
│            STORES (store/)              │  ← Les DONNÉES en mémoire
│   (État de l'app, qui est connecté...)  │
├─────────────────────────────────────────┤
│          SERVICES API (api/)            │  ← SAUVEGARDE des données
│   (Lecture/écriture dans le stockage)   │
├─────────────────────────────────────────┤
│        ASYNC STORAGE (téléphone)        │  ← STOCKAGE permanent
│   (Données sauvegardées sur l'appareil) │
└─────────────────────────────────────────┘
```

**Pourquoi séparer comme ça ?**
- Chaque partie a un rôle clair
- Si on doit changer quelque chose, on sait où aller
- On peut tester chaque partie séparément
- Le code est plus organisé et maintenable

---

## 4. Comment fonctionne React Native ? 🔄

### Les Composants

**C'est quoi un composant ?** C'est comme un bloc LEGO. Tu combines plusieurs blocs pour construire ton application.

**Exemple simple :**
```tsx
// Un composant "Bouton"
function MonBouton() {
  return (
    <TouchableOpacity>
      <Text>Cliquez-moi !</Text>
    </TouchableOpacity>
  );
}

// Utilisation
<MonBouton />
<MonBouton />  // On peut le réutiliser autant de fois qu'on veut !
```

### Les Composants de Base React Native

| Composant | C'est quoi ? | Équivalent HTML |
|-----------|--------------|-----------------|
| `<View>` | Un conteneur (une boîte) | `<div>` |
| `<Text>` | Du texte | `<p>` ou `<span>` |
| `<TouchableOpacity>` | Un bouton cliquable | `<button>` |
| `<TextInput>` | Un champ de saisie | `<input>` |
| `<FlatList>` | Une liste déroulante | `<ul>` |
| `<Image>` | Une image | `<img>` |
| `<ScrollView>` | Zone scrollable | `<div>` avec scroll |

### Le JSX

**C'est quoi ?** C'est un mélange de JavaScript et de syntaxe similaire au HTML.

```tsx
// Ça c'est du JSX
function MonEcran() {
  const nom = "Jean";
  
  return (
    <View>
      <Text>Bonjour {nom}!</Text>  {/* On peut mettre du JS entre {} */}
    </View>
  );
}
```

### Les Props (Propriétés)

**C'est quoi ?** Ce sont des paramètres qu'on passe à un composant.

```tsx
// Composant avec props
function Salutation({ nom, age }) {
  return (
    <Text>Bonjour {nom}, tu as {age} ans</Text>
  );
}

// Utilisation
<Salutation nom="Jean" age={25} />
// Affiche: "Bonjour Jean, tu as 25 ans"
```

### Le State (État)

**C'est quoi ?** C'est la "mémoire" d'un composant. Quand l'état change, le composant se redessine automatiquement.

```tsx
function Compteur() {
  // useState crée une variable d'état
  // compteur = la valeur actuelle (0 au début)
  // setCompteur = fonction pour changer la valeur
  const [compteur, setCompteur] = useState(0);
  
  return (
    <View>
      <Text>Compteur: {compteur}</Text>
      <TouchableOpacity onPress={() => setCompteur(compteur + 1)}>
        <Text>+1</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 5. Le Système de Navigation 🧭

### C'est quoi la Navigation ?

C'est comment l'utilisateur passe d'un écran à un autre. Comme quand tu cliques sur un lien sur un site web.

### Les Types de Navigateurs dans notre App

#### 1. Stack Navigator (Navigation en pile)
**Concept :** Les écrans s'empilent les uns sur les autres. Le bouton "retour" retire l'écran du dessus.

```
Écran 3 (dessus)    ← Dernier ouvert
Écran 2
Écran 1 (dessous)   ← Premier ouvert
```

**Dans notre projet :**
```tsx
// AuthNavigator.tsx
const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}
```

#### 2. Tab Navigator (Navigation par onglets)
**Concept :** Des onglets en bas de l'écran pour changer de section.

```
┌────────────────────────────────┐
│                                │
│     Contenu de l'écran        │
│                                │
├──────────┬─────────────────────┤
│ Onglet 1 │     Onglet 2       │  ← Barre d'onglets
└──────────┴─────────────────────┘
```

**Dans notre projet :**
```tsx
// PatientNavigator.tsx
const Tab = createBottomTabNavigator();

export default function PatientNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen 
                name="OrdonnanceStack" 
                component={PatientOrdonnanceNavigator}
                options={{
                    title: 'Mes Ordonnances',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="document-text" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name="CommandeStack" 
                component={PatientCommandeNavigator}
            />
        </Tab.Navigator>
    );
}
```

### Le Flux de Navigation Complet

```
                    AppNavigator (décide où aller)
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
  AuthNavigator     PatientNavigator   PharmacienNavigator
  (Pas connecté)    (Rôle: patient)    (Rôle: pharmacien)
        │                  │                  │
        ▼              ┌───┴───┐          ┌───┴───┐
   LoginScreen         │       │          │       │
                      TAB     TAB        TAB     TAB
                       │       │          │       │
              Ordonnances  Commandes  Commandes  Médicaments
                   │                       │
              ┌────┴────┐            ┌─────┴─────┐
              │         │            │           │
           Liste    Détail        Liste      Ajouter
           Form                             Modifier
```

### Comment on navigue entre les écrans ?

```tsx
// Dans un écran, on reçoit "navigation" automatiquement
function OrdonnanceListScreen({ navigation }) {
    
    // Pour aller vers un autre écran
    const allerVersDetail = () => {
        navigation.navigate('OrdonnanceDetail', { 
            ordonnanceId: '123'  // On peut passer des paramètres
        });
    };
    
    // Pour revenir en arrière
    const retour = () => {
        navigation.goBack();
    };
    
    return (
        <TouchableOpacity onPress={allerVersDetail}>
            <Text>Voir détails</Text>
        </TouchableOpacity>
    );
}
```

### Le Fichier `AppNavigator.tsx` Expliqué

C'est le "chef d'orchestre" de la navigation :

```tsx
export default function AppNavigator() {
    // On récupère les infos de connexion depuis le store
    const { currentUser, isAuthenticated, isLoading, loadSession } = useAuthStore();
    
    // Au démarrage, on charge la session sauvegardée
    useEffect(() => {
        const initialize = async () => {
            await initializeSeedData();  // Crée les données de test
            await loadSession();         // Vérifie si déjà connecté
        };
        initialize();
    }, []);
    
    // On affiche le bon navigateur selon la situation
    if (!isAuthenticated || !currentUser) {
        return <AuthNavigator />;  // Pas connecté → écran de login
    }
    
    switch (currentUser.role) {
        case 'patient':
            return <PatientNavigator />;    // Patient → écrans patient
        case 'pharmacien':
            return <PharmacienNavigator />; // Pharmacien → écrans pharmacien
        default:
            return <AuthNavigator />;
    }
}
```

---

## 6. La Gestion de l'État avec Zustand 🏪

### C'est quoi l'État Global ?

Imagine que tu as 10 écrans dans ton app. Chacun a besoin de savoir qui est l'utilisateur connecté. Sans état global, tu devrais passer cette info de parent en enfant, de parent en enfant... C'est compliqué !

**L'état global** = Une "boîte" centrale où on stocke les données que plusieurs écrans ont besoin.

### Comment ça marche avec Zustand ?

```tsx
// 1. CRÉER un store (une boîte de données)
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    // Les données
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    
    // Les actions (fonctions pour modifier les données)
    login: async (email, password, role) => {
        set({ isLoading: true });  // Met isLoading à true
        
        const user = await authenticateUser(email, password, role);
        
        if (user) {
            set({ 
                currentUser: user, 
                isAuthenticated: true, 
                isLoading: false 
            });
            return true;
        } else {
            set({ error: 'Identifiants incorrects', isLoading: false });
            return false;
        }
    },
    
    logout: async () => {
        await clearSession();
        set({ currentUser: null, isAuthenticated: false });
    },
}));
```

```tsx
// 2. UTILISER le store dans n'importe quel composant
function MonComposant() {
    // On "pioche" ce qu'on a besoin dans le store
    const { currentUser, isAuthenticated, login, logout } = useAuthStore();
    
    if (!isAuthenticated) {
        return <Text>Veuillez vous connecter</Text>;
    }
    
    return (
        <View>
            <Text>Bonjour {currentUser.name}!</Text>
            <TouchableOpacity onPress={logout}>
                <Text>Déconnexion</Text>
            </TouchableOpacity>
        </View>
    );
}
```

### Les Stores de l'Application

#### 1. `authStore.ts` - Authentification
```
Données:
- currentUser: L'utilisateur connecté
- isAuthenticated: true/false
- isLoading: Pour afficher un loader
- error: Message d'erreur

Actions:
- login(email, password, role): Se connecter
- logout(): Se déconnecter
- loadSession(): Charger une session sauvegardée
```

#### 2. `ordonnanceStore.ts` - Ordonnances
```
Données:
- ordonnances: Liste des ordonnances

Actions:
- loadOrdonnances(): Charger toutes les ordonnances
- loadOrdonnancesByPatient(patientId): Charger les ordonnances d'un patient
- addOrdonnance(ordonnance): Ajouter une ordonnance
```

#### 3. `commandeStore.ts` - Commandes
```
Données:
- commandes: Liste des commandes

Actions:
- loadCommandes(): Charger toutes les commandes
- loadCommandesByPatient(patientId): Charger les commandes d'un patient
- addCommande(commande): Créer une commande
- updateCommandeStatus(id, status): Changer le statut
```

#### 4. `medicamentStore.ts` - Médicaments
```
Données:
- medicaments: Liste des médicaments

Actions:
- loadMedicaments(): Charger tous les médicaments
- addMedicament(med): Ajouter un médicament
- updateMedicament(id, updates): Modifier un médicament
- deleteMedicament(id): Supprimer un médicament
```

---

## 7. Les Services API 🔌

### C'est quoi la couche API/Services ?

C'est la partie du code qui s'occupe de **lire et écrire les données** dans le stockage.

### Pourquoi séparer les services ?

```
ÉCRAN (UI)
    ↓ Appelle
STORE (État)
    ↓ Appelle
SERVICE (API)
    ↓ Appelle
ASYNC STORAGE (Stockage)
```

**Avantages :**
- Si on change de système de stockage (ex: base de données en ligne), on change seulement les services
- Le code est plus organisé
- On peut tester chaque partie séparément

### Exemple de Service : `userService.ts`

```typescript
// userService.ts - Gestion des utilisateurs

// Récupérer tous les utilisateurs
export const getUsers = async (): Promise<User[]> => {
    return (await getItem<User[]>('users')) || [];
};

// Ajouter un utilisateur
export const addUser = async (user: User): Promise<User[]> => {
    const users = await getUsers();       // 1. Récupérer la liste actuelle
    const newList = [...users, user];     // 2. Ajouter le nouvel utilisateur
    await saveItem('users', newList);     // 3. Sauvegarder la nouvelle liste
    return newList;                        // 4. Retourner la liste mise à jour
};

// Authentifier un utilisateur (vérifier email + password)
export const authenticateUser = async (
    email: string,
    password: string,
    role: string
): Promise<User | null> => {
    const user = await getUserByEmail(email);  // Chercher l'utilisateur par email
    
    // Vérifier si le mot de passe et le rôle correspondent
    if (user && user.password === password && user.role === role) {
        return user;  // Connexion réussie
    }
    return null;      // Échec de connexion
};

// Sauvegarder la session (pour rester connecté)
export const saveSession = async (user: User): Promise<void> => {
    await saveItem('session', user);
};

// Récupérer la session sauvegardée
export const getSession = async (): Promise<User | null> => {
    return await getItem<User>('session');
};
```

### Tous les Services

| Service | Fichier | Rôle |
|---------|---------|------|
| Users | `userService.ts` | Connexion, inscription, session |
| Ordonnances | `ordonnanceService.ts` | CRUD des ordonnances |
| Commandes | `commandeService.ts` | CRUD des commandes |
| Médicaments | `medicamentService.ts` | CRUD des médicaments |
| Pharmacies | `pharmacieService.ts` | CRUD des pharmacies |

**CRUD** = Create (Créer), Read (Lire), Update (Mettre à jour), Delete (Supprimer)

---

## 8. Le Stockage des Données 💾

### AsyncStorage - Notre "Base de Données"

Dans cette application, on utilise **AsyncStorage** pour stocker les données. C'est comme le localStorage du navigateur, mais pour les apps mobiles.

**Caractéristiques :**
- Stocke des données sur le téléphone
- Persiste même si l'app est fermée
- Stocke seulement des chaînes de caractères (on convertit en JSON)

### Le fichier `asyncStorage.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// SAUVEGARDER une donnée
export const saveItem = async <T>(key: string, value: T): Promise<void> => {
    try {
        // On convertit l'objet en texte JSON
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Erreur sauvegarde', error);
        throw error;
    }
};

// RÉCUPÉRER une donnée
export const getItem = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await AsyncStorage.getItem(key);
        // On reconvertit le texte JSON en objet
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erreur lecture', error);
        return null;
    }
};

// SUPPRIMER une donnée
export const removeItem = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Erreur suppression', error);
        throw error;
    }
};
```

### Comment les Données sont Organisées

```
AsyncStorage (sur le téléphone)
├── "users"        → [{ id: "u1", name: "Jean", ... }, ...]
├── "session"      → { id: "u1", name: "Jean", role: "patient", ... }
├── "ordonnances"  → [{ id: "o1", patientId: "u1", ... }, ...]
├── "commandes"    → [{ id: "c1", status: "EN_ATTENTE", ... }, ...]
├── "medicaments"  → [{ id: "m1", nom: "Doliprane", ... }, ...]
└── "pharmacies"   → [{ id: "p1", nom: "Pharmacie Centrale", ... }, ...]
```

### Les Données de Test (`seedData.ts`)

Au premier lancement, l'app crée automatiquement des données de test :

```typescript
// Utilisateurs de test
export const seedUsers: User[] = [
    {
        id: 'u222',
        role: 'patient',
        name: 'Jean Dupont',
        email: 'jean@patient.fr',
        password: 'patient123',
    },
    {
        id: 'u333',
        role: 'pharmacien',
        name: 'Marie Dubois',
        email: 'marie@pharmacie.fr',
        password: 'pharmacien123',
    },
    // ...
];

// Médicaments de test
export const seedMedicaments: Medicament[] = [
    {
        id: 'm001',
        nom: 'Doliprane',
        dosage: '500',
        forme: 'Comprimé',
        quantiteStock: 120,
        fabricant: 'Sanofi',
    },
    // ...
];
```

---

## 9. Les Types TypeScript 📋

### C'est quoi un Type ?

Un type définit la "forme" d'une donnée. C'est comme un formulaire qui dit quels champs sont obligatoires et quel format ils doivent avoir.

### Les Types Principaux de l'Application

#### `User` (Utilisateur)
```typescript
export interface User {
    id: string;                              // Identifiant unique
    role: 'medecin' | 'patient' | 'pharmacien';  // Rôle (choix limité)
    name: string;                            // Nom complet
    email: string;                           // Email
    password?: string;                       // Mot de passe (optionnel avec ?)
}
```

#### `Medicament` (Médicament)
```typescript
export interface Medicament {
    id: string;              // Identifiant unique
    nom: string;             // Nom du médicament
    dosage: string;          // Dosage (ex: "500")
    forme: string;           // Forme (ex: "Comprimé", "Sirop")
    quantiteStock: number;   // Quantité en stock
    fabricant?: string;      // Fabricant (optionnel)
}
```

#### `Ordonnance` (Ordonnance)
```typescript
export interface MedicamentPrescrit {
    idMedicament: string;    // Quel médicament
    quantiteParJour: number; // Combien par jour
    duree: number;           // Pendant combien de jours
}

export interface Ordonnance {
    id: string;                       // Identifiant unique
    date: string;                     // Date de création
    dateExpiration: string;           // Date d'expiration
    medecinId: string;                // Qui a prescrit
    patientId: string;                // Pour quel patient
    medicaments: MedicamentPrescrit[]; // Liste des médicaments prescrits
    isUsed?: boolean;                 // Déjà utilisée pour une commande ?
}
```

#### `Commande` (Commande)
```typescript
export type CommandeStatus = 
    | 'EN_ATTENTE'      // En attente de traitement
    | 'EN_PREPARATION'  // En cours de préparation
    | 'PRETE'           // Prête à être récupérée
    | 'RECUPEREE'       // Récupérée par le patient
    | 'RETOURNEE';      // Retournée

export interface Commande {
    id: string;
    ordonnanceId: string;     // Liée à quelle ordonnance
    patientId: string;        // Quel patient
    pharmacieId: string;      // Quelle pharmacie
    status: CommandeStatus;   // Statut actuel
    dateCreation: string;     // Date de création
    lieuLivraison?: string;   // Adresse de livraison (optionnel)
    remarques?: string;       // Notes (optionnel)
}
```

### Pourquoi les Types sont Importants ?

1. **Autocomplétion** : L'éditeur suggère les propriétés disponibles
2. **Détection d'erreurs** : Erreur si on utilise une propriété inexistante
3. **Documentation** : On comprend rapidement la structure des données
4. **Refactoring sûr** : Si on change un type, on voit tous les endroits à modifier

---

## 10. Le Système de Thème 🎨

### C'est quoi le Thème ?

C'est l'ensemble des styles visuels de l'application : couleurs, espacements, ombres, etc.

### Les Couleurs (`colors.ts`)

```typescript
export const colors = {
    // Couleurs principales
    primary: '#0066FF',        // Bleu principal
    primaryLight: '#3D8BFF',   // Bleu clair
    primaryDark: '#0052CC',    // Bleu foncé
    
    // Couleurs de fond
    background: '#F8FAFC',     // Fond de page
    surface: '#FFFFFF',        // Fond des cartes
    
    // Couleurs de texte
    textPrimary: '#0F172A',    // Texte principal (noir)
    textSecondary: '#475569',  // Texte secondaire (gris)
    textTertiary: '#94A3B8',   // Texte tertiaire (gris clair)
    
    // Couleurs de statut
    success: '#10B981',        // Vert (succès)
    warning: '#F59E0B',        // Orange (attention)
    danger: '#EF4444',         // Rouge (erreur)
    
    // Couleurs des statuts de commande
    statusEnAttente: '#F59E0B',      // Orange
    statusEnPreparation: '#0066FF',  // Bleu
    statusPrete: '#10B981',          // Vert
    statusRecuperee: '#6366F1',      // Violet
    statusRetournee: '#EF4444',      // Rouge
};
```

### Les Gradients (Dégradés)

```typescript
// Un dégradé va d'une couleur à une autre
gradientPrimary: ['#0066FF', '#6366F1'],  // Bleu vers violet
gradientSuccess: ['#10B981', '#06B6D4'],  // Vert vers cyan
```

### Les Ombres (`shadows`)

```typescript
shadows: {
    sm: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,  // Pour Android
    },
    // ...
}
```

### Comment Utiliser le Thème

```tsx
import { colors, spacing, shadows } from '../theme';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        padding: spacing.md,
        ...shadows.sm,  // On applique l'ombre
    },
    title: {
        color: colors.textPrimary,
        fontSize: 20,
    },
});
```

---

## 11. Les Hooks React 🪝

### C'est quoi un Hook ?

Un Hook est une fonction spéciale qui permet d'utiliser des fonctionnalités React dans les composants fonctionnels.

### Les Hooks Utilisés dans le Projet

#### 1. `useState` - Gérer l'état local

```tsx
function MonComposant() {
    // Crée une variable d'état et une fonction pour la modifier
    const [texte, setTexte] = useState('');
    const [compteur, setCompteur] = useState(0);
    
    return (
        <View>
            <TextInput 
                value={texte} 
                onChangeText={setTexte}  // Met à jour texte quand on tape
            />
            <Text>Compteur: {compteur}</Text>
            <Button onPress={() => setCompteur(compteur + 1)} title="+1" />
        </View>
    );
}
```

#### 2. `useEffect` - Exécuter du code à certains moments

```tsx
function MonComposant() {
    const [data, setData] = useState([]);
    
    // useEffect avec tableau vide [] = s'exécute UNE FOIS au chargement
    useEffect(() => {
        console.log('Le composant vient de se charger !');
        loadData();
    }, []);
    
    // useEffect avec dépendance = s'exécute quand la dépendance change
    useEffect(() => {
        console.log('userId a changé !');
        loadUserData(userId);
    }, [userId]);  // Se re-exécute quand userId change
    
    return <View>...</View>;
}
```

#### 3. `useMemo` - Mémoriser un calcul coûteux

```tsx
function ListeMedicaments({ medicaments }) {
    const [searchQuery, setSearchQuery] = useState('');
    
    // useMemo évite de recalculer si medicaments et searchQuery n'ont pas changé
    const filteredMedicaments = useMemo(() => {
        return medicaments.filter(med => 
            med.nom.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [medicaments, searchQuery]);  // Recalcule seulement si ces valeurs changent
    
    return <FlatList data={filteredMedicaments} ... />;
}
```

#### 4. Hooks Personnalisés (Custom Hooks)

Les stores Zustand sont des hooks personnalisés !

```tsx
// useAuthStore est un hook personnalisé
const { currentUser, login, logout } = useAuthStore();

// useColorScheme est un autre hook
const colorScheme = useColorScheme();  // Retourne 'dark' ou 'light'
```

---

## 12. Les Composants et Écrans 📺

### Différence entre Composant et Écran

- **Composant** : Petit bloc réutilisable (bouton, carte, champ de texte...)
- **Écran** : Page complète composée de plusieurs composants

### Structure d'un Écran Type

Prenons l'exemple de `OrdonnanceListScreen.tsx` :

```tsx
// 1. IMPORTS - Ce dont on a besoin
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useOrdonnanceStore } from '../../store/ordonnanceStore';

// 2. COMPOSANT ÉCRAN
export default function OrdonnanceListScreen({ navigation }) {
    // 3. HOOKS D'ÉTAT LOCAL
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    
    // 4. HOOKS DE STORES GLOBAUX
    const { currentUser } = useAuthStore();
    const { ordonnances, isLoading, loadOrdonnancesByPatient } = useOrdonnanceStore();
    
    // 5. EFFETS (chargement des données)
    useEffect(() => {
        if (currentUser) {
            loadOrdonnancesByPatient(currentUser.id);
        }
    }, [currentUser]);
    
    // 6. FONCTIONS UTILITAIRES
    const filteredOrdonnances = ordonnances.filter(ord =>
        ord.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const handleItemPress = (ordonnance) => {
        navigation.navigate('OrdonnanceDetail', { ordonnanceId: ordonnance.id });
    };
    
    // 7. RENDU - Ce qu'on affiche
    return (
        <View style={styles.container}>
            {/* Header avec titre */}
            <View style={styles.header}>
                <Text style={styles.title}>Mes Ordonnances</Text>
            </View>
            
            {/* Barre de recherche */}
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher..."
            />
            
            {/* Liste des ordonnances */}
            <FlatList
                data={filteredOrdonnances}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleItemPress(item)}>
                        <Text>{item.id}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

// 8. STYLES
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold' },
});
```

### Les Écrans du Patient

| Écran | Fichier | Ce qu'il fait |
|-------|---------|---------------|
| Liste Ordonnances | `OrdonnanceListScreen.tsx` | Affiche toutes les ordonnances du patient |
| Détail Ordonnance | `OrdonnanceDetailScreen.tsx` | Détails d'une ordonnance + bouton commander |
| Formulaire Commande | `CommandeFormScreen.tsx` | Formulaire pour créer une commande |
| Liste Commandes | `CommandeListScreen.tsx` | Affiche toutes les commandes |
| Détail Commande | `PatientCommandeDetailScreen.tsx` | Détails d'une commande |

### Les Écrans du Pharmacien

| Écran | Fichier | Ce qu'il fait |
|-------|---------|---------------|
| Liste Médicaments | `MedicamentListScreen.tsx` | Affiche l'inventaire |
| Ajouter Médicament | `AddMedicamentScreen.tsx` | Formulaire d'ajout |
| Modifier Médicament | `EditMedicamentScreen.tsx` | Formulaire de modification |
| Liste Commandes | `CommandeListScreen.tsx` | Commandes à traiter |
| Détail Commande | `CommandeDetailScreen.tsx` | Détails + changer statut |

---

## 13. Le Flux d'Authentification 🔐

### Comment ça marche de A à Z

```
1. L'APP DÉMARRE
       │
       ▼
2. AppNavigator charge
       │
       ▼
3. initializeSeedData() → Crée les données de test si première fois
       │
       ▼
4. loadSession() → Vérifie si une session est sauvegardée
       │
       ├── Session trouvée → currentUser = user, isAuthenticated = true
       │                           │
       │                           ▼
       │                     PatientNavigator OU PharmacienNavigator
       │
       └── Pas de session → isAuthenticated = false
                                │
                                ▼
                          AuthNavigator → LoginScreen
```

### Le Processus de Connexion

```tsx
// Dans LoginScreen.tsx
const handleLogin = async () => {
    // 1. Appeler la fonction login du store
    const success = await login(email, password, role);
    
    // 2. Si succès, login() a mis à jour:
    //    - currentUser = l'utilisateur
    //    - isAuthenticated = true
    
    // 3. AppNavigator détecte le changement et affiche le bon navigateur
};

// Dans authStore.ts
login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    
    // 1. Vérifier les identifiants
    const user = await authenticateUser(email, password, role);
    
    if (user) {
        // 2. Sauvegarder la session
        await saveSession(user);
        
        // 3. Mettre à jour l'état
        set({
            currentUser: user,
            isAuthenticated: true,
            isLoading: false,
        });
        return true;
    } else {
        set({ error: 'Identifiants incorrects', isLoading: false });
        return false;
    }
}
```

### La Déconnexion

```tsx
// Dans le navigateur (PatientNavigator ou PharmacienNavigator)
headerRight: () => (
    <TouchableOpacity onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color="white" />
    </TouchableOpacity>
)

// Dans authStore.ts
logout: async () => {
    set({ isLoading: true });
    
    // 1. Effacer la session sauvegardée
    await clearSession();
    
    // 2. Réinitialiser l'état
    set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
    });
    
    // 3. AppNavigator détecte le changement → affiche AuthNavigator
}
```

---

## 14. Questions Fréquentes du Professeur 📝

### Q1: "Pourquoi avoir choisi React Native ?"

**Réponse :** 
> React Native permet de développer une application mobile pour iOS ET Android avec un seul code JavaScript/TypeScript. C'est plus efficace que de développer deux applications séparées. De plus, les performances sont proches des applications natives car React Native utilise les composants natifs du téléphone.

### Q2: "C'est quoi l'architecture de votre projet ?"

**Réponse :**
> Le projet suit une architecture en couches :
> - **Couche UI (screens/)** : Les écrans que l'utilisateur voit
> - **Couche État (store/)** : La gestion des données avec Zustand
> - **Couche Services (api/)** : La communication avec le stockage
> - **Couche Données (AsyncStorage)** : Le stockage persistant
>
> Cette séparation permet une meilleure maintenabilité et testabilité du code.

### Q3: "Comment fonctionne la navigation ?"

**Réponse :**
> On utilise React Navigation avec deux types de navigateurs :
> - **Stack Navigator** : Pour empiler les écrans (liste → détail → formulaire)
> - **Tab Navigator** : Pour les onglets en bas de l'écran
>
> Le `AppNavigator` est le point d'entrée qui décide quel navigateur afficher selon que l'utilisateur est connecté et son rôle.

### Q4: "Comment gérez-vous l'état de l'application ?"

**Réponse :**
> On utilise **Zustand**, une bibliothèque légère de gestion d'état. Chaque "store" (authStore, ordonnanceStore, etc.) contient :
> - Les données (état)
> - Les actions pour modifier ces données
>
> Les composants peuvent accéder à l'état global sans avoir à passer les props de parent en enfant.

### Q5: "Où sont stockées les données ?"

**Réponse :**
> Les données sont stockées localement sur l'appareil avec **AsyncStorage**. C'est similaire au localStorage du web. Les données sont converties en JSON pour le stockage et reconverties en objets JavaScript lors de la lecture.

### Q6: "Pourquoi utiliser TypeScript ?"

**Réponse :**
> TypeScript ajoute le typage statique à JavaScript. Les avantages sont :
> - Détection des erreurs à la compilation (avant l'exécution)
> - Meilleure autocomplétion dans l'éditeur
> - Documentation implicite du code
> - Code plus maintenable sur le long terme

### Q7: "Expliquez le cycle de vie d'une commande"

**Réponse :**
> 1. Le patient voit ses ordonnances non utilisées
> 2. Il sélectionne une ordonnance et crée une commande
> 3. La commande est créée avec le statut "EN_ATTENTE"
> 4. Le pharmacien voit la commande et peut changer son statut :
>    - EN_PREPARATION → quand il prépare les médicaments
>    - PRETE → quand c'est prêt (le stock est décrémenté)
>    - RECUPEREE → quand le patient a récupéré
>    - RETOURNEE → si retour (le stock est restauré)

### Q8: "Comment fonctionne l'authentification ?"

**Réponse :**
> 1. Au démarrage, on vérifie s'il y a une session sauvegardée
> 2. Si oui, l'utilisateur est automatiquement connecté
> 3. Sinon, l'écran de login s'affiche
> 4. À la connexion, on vérifie email + mot de passe + rôle
> 5. Si valide, on sauvegarde la session et on affiche le bon navigateur
> 6. À la déconnexion, on efface la session

### Q9: "Qu'est-ce que useEffect et quand l'utilisez-vous ?"

**Réponse :**
> `useEffect` est un Hook React qui permet d'exécuter du code "effet de bord" :
> - Au montage du composant (chargement initial)
> - Quand certaines valeurs changent
>
> On l'utilise pour charger les données au démarrage d'un écran ou pour réagir à des changements de valeurs.

### Q10: "Comment avez-vous organisé les styles ?"

**Réponse :**
> On a un système de thème centralisé dans le dossier `theme/` qui contient :
> - **colors.ts** : Toutes les couleurs de l'application
> - **spacing.ts** : Les espacements standards
> - **typography.ts** : Les styles de texte
>
> Chaque écran utilise `StyleSheet.create()` pour ses styles locaux, en important les constantes du thème pour la cohérence.

---

## 15. Les Règles Métier et Validations ✅

Cette section explique toutes les **validations** et **règles métier** implémentées dans l'application pour assurer l'intégrité des données.

### 15.1 Persistance des Données (Session)

**Problème résolu :** Les données n'étaient pas persistantes entre les lancements de l'app.

**Solution (`seedData.ts`) :**
```typescript
const SEED_INITIALIZED_KEY = 'seed_data_initialized';

export const initializeSeedData = async (): Promise<void> => {
    // Vérifier si les données ont déjà été initialisées
    const isInitialized = await getItem<boolean>(SEED_INITIALIZED_KEY);
    
    if (isInitialized) {
        console.log('Seed data already initialized, skipping...');
        return;  // Ne pas écraser les données existantes !
    }
    
    // Première fois seulement : initialiser les données de test
    await saveItem('users', seedUsers);
    await saveItem('medicaments', seedMedicaments);
    // ...
    
    // Marquer comme initialisé
    await saveItem(SEED_INITIALIZED_KEY, true);
};
```

**Pourquoi c'est important ?** Sans ce flag, à chaque lancement de l'app, toutes les données utilisateur (commandes, modifications) seraient perdues.

---

### 15.2 Protection des Médicaments

**Règle 1 : Un médicament ne peut pas être supprimé s'il est dans une ordonnance active**

```typescript
// medicamentService.ts - deleteMedicament()

// 1. Chercher les ordonnances actives utilisant ce médicament
const activeOrdonnances = ordonnances.filter(ord =>
    !ord.isUsed &&                           // Non utilisée
    new Date(ord.dateExpiration) > now &&    // Non expirée
    ord.medicaments.some(m => m.idMedicament === id)  // Contient ce médicament
);

if (activeOrdonnances.length > 0) {
    throw new Error(`Ce médicament est utilisé dans ${activeOrdonnances.length} ordonnance(s) active(s)`);
}
```

**Règle 2 : Un médicament ne peut pas être supprimé s'il est dans une commande en cours**

```typescript
// Vérifier les commandes en cours (pas encore récupérées/retournées)
const pendingCommandes = commandes.filter(cmd => {
    if (cmd.status === 'RECUPEREE' || cmd.status === 'RETOURNEE') return false;
    const ord = ordonnances.find(o => o.id === cmd.ordonnanceId);
    return ord?.medicaments.some(m => m.idMedicament === id);
});

if (pendingCommandes.length > 0) {
    throw new Error(`Ce médicament est dans ${pendingCommandes.length} commande(s) en cours`);
}
```

---

### 15.3 Validation des Commandes

**Lors de la création d'une commande (`commandeStore.ts`) :**

```typescript
addCommande: async (commande) => {
    // ✅ Vérification 1 : L'ordonnance n'est pas déjà utilisée
    const ordonnance = await getOrdonnanceById(commande.ordonnanceId);
    if (ordonnance?.isUsed) {
        throw new Error('Cette ordonnance a déjà été utilisée pour une commande');
    }

    // ✅ Vérification 2 : L'ordonnance n'est pas expirée
    if (new Date(ordonnance.dateExpiration) < new Date()) {
        throw new Error('Cette ordonnance est expirée');
    }

    // ✅ Vérification 3 : Tous les médicaments existent encore
    for (const med of ordonnance.medicaments) {
        const medicament = await getMedicamentById(med.idMedicament);
        if (!medicament) {
            throw new Error(`Le médicament prescrit n'est plus disponible`);
        }
        
        // ✅ Vérification 4 : Stock suffisant
        const totalQuantity = med.quantiteParJour * med.duree;
        if (medicament.quantiteStock < totalQuantity) {
            throw new Error(`Stock insuffisant pour ${medicament.nom}`);
        }
    }

    // Marquer l'ordonnance comme utilisée
    await updateOrdonnance(commande.ordonnanceId, { isUsed: true });
    
    // Créer la commande
    const updated = await addCommande(commande);
}
```

---

### 15.4 Gestion du Stock

**Le cycle de vie du stock :**

```
                    ┌─────────────────────┐
                    │    EN_ATTENTE      │ ← Stock intact
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  EN_PREPARATION    │ ← Stock intact
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │      PRETE         │ ← Stock DÉDUIT (-quantité)
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │   RECUPEREE    │             │   RETOURNEE    │
    │ Stock déduit   │             │ Stock RESTAURÉ │
    └─────────────────┘             └─────────────────┘
```

**Code de gestion du stock (`commandeStore.ts`) :**

```typescript
updateCommandeStatus: async (id, status) => {
    const commande = await getCommandeById(id);
    const ordonnance = await getOrdonnanceById(commande.ordonnanceId);

    // Statuts où le stock a été déduit
    const stockDeductedStatuses = ['PRETE', 'RECUPEREE'];
    const wasStockDeducted = stockDeductedStatuses.includes(commande.status);
    const willStockBeDeducted = stockDeductedStatuses.includes(status);

    // DÉDUIRE le stock quand on passe à PRETE
    if (status === 'PRETE' && !wasStockDeducted) {
        for (const med of ordonnance.medicaments) {
            const totalQuantity = med.quantiteParJour * med.duree;
            await updateMedicamentStock(med.idMedicament, -totalQuantity);
        }
    }

    // RESTAURER le stock si commande retournée
    if (status === 'RETOURNEE' && wasStockDeducted) {
        for (const med of ordonnance.medicaments) {
            const totalQuantity = med.quantiteParJour * med.duree;
            await updateMedicamentStock(med.idMedicament, +totalQuantity);
        }
    }

    // RESTAURER si on revient en arrière (annulation)
    if (!willStockBeDeducted && status !== 'RETOURNEE' && wasStockDeducted) {
        for (const med of ordonnance.medicaments) {
            const totalQuantity = med.quantiteParJour * med.duree;
            await updateMedicamentStock(med.idMedicament, +totalQuantity);
        }
    }
}
```

---

### 15.5 Indicateurs Visuels dans l'Interface

**Dans `OrdonnanceDetailScreen.tsx`, on affiche des alertes visuelles :**

```typescript
// Vérifier si des médicaments manquent ou ont un stock insuffisant
const hasMissingMedications = ordonnance.medicaments.some(med => {
    const medicament = medicaments.find(m => m.id === med.idMedicament);
    return !medicament;  // Médicament supprimé
});

const hasInsufficientStock = ordonnance.medicaments.some(med => {
    const medicament = medicaments.find(m => m.id === med.idMedicament);
    if (!medicament) return false;
    const totalNeeded = med.quantiteParJour * med.duree;
    return medicament.quantiteStock < totalNeeded;
});

// Peut-on créer une commande ?
const canCreateOrder = !ordonnance.isUsed && 
                       !isExpired && 
                       !hasMissingMedications && 
                       !hasInsufficientStock;
```

**Affichage des alertes :**
- 🔴 **Bordure rouge** + icône : Médicament supprimé du catalogue
- 🟠 **Bordure orange** + icône : Stock insuffisant
- ❌ **Bouton désactivé** avec message explicatif

---

### 15.6 Tableau Récapitulatif des Validations

| Action | Validations | Message d'erreur |
|--------|-------------|------------------|
| **Supprimer médicament** | Pas dans ordonnance active | "Utilisé dans X ordonnance(s)" |
| **Supprimer médicament** | Pas dans commande en cours | "Dans X commande(s) en cours" |
| **Créer commande** | Ordonnance non utilisée | "Déjà utilisée" |
| **Créer commande** | Ordonnance non expirée | "Ordonnance expirée" |
| **Créer commande** | Médicaments existants | "Médicament indisponible" |
| **Créer commande** | Stock suffisant | "Stock insuffisant pour X" |
| **Changer statut → PRETE** | Stock suffisant | "Stock insuffisant" |

---

## 16. Diagrammes de Flux de Données 📊

### 16.1 Flux de Connexion

```
┌──────────────────────────────────────────────────────────────┐
│                        DÉMARRAGE APP                        │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  initializeSeedData │
                    │  (si premier launch)│
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   loadSession()     │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │                               │
    Session existe ?                  Pas de session
              │                               │
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │  isAuthenticated│             │  AuthNavigator  │
    │     = true      │             │  (LoginScreen)  │
    └────────┬────────┘             └─────────────────┘
              │
     Quel rôle ?
              │
    ┌─────────┴─────────┐
    ▼                   ▼
  Patient          Pharmacien
    │                   │
    ▼                   ▼
PatientNavigator   PharmacienNavigator
```

### 16.2 Flux de Commande

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PATIENT                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Voir ordonnances  ────►  2. Sélectionner  ────►  3. Commander  │
│     (OrdonnanceList)          (OrdonnanceDetail)     (CommandeForm) │
│                                                                     │
│         │                          │                      │         │
│         │ Charge les              │ Vérifie:             │ Crée    │
│         │ ordonnances             │ - Expiration         │ commande│
│         │ du patient              │ - Déjà utilisée      │ status: │
│         │                         │ - Médicaments dispo  │ EN_ATTENTE
│         │                         │ - Stock suffisant    │         │
│         │                         │                      │         │
└─────────┴──────────────────────────┴──────────────────────┴─────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    PHARMACIEN                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  4. Voir commandes  ────►  5. Détail commande  ────►  6. Changer   │
│     (CommandeList)          (CommandeDetail)           statut       │
│                                                                     │
│         │                         │                      │          │
│         │ Charge les             │ Affiche infos        │ Gère le  │
│         │ commandes              │ patient,             │ stock    │
│         │ de la pharmacie        │ ordonnance,          │ selon    │
│         │                        │ médicaments          │ statut   │
│         │                        │                      │          │
└─────────┴─────────────────────────┴──────────────────────┴──────────┘
```

---

## 17. Guide de Démarrage Rapide 🚀

### 17.1 Prérequis

- **Node.js** version 18+ 
- **npm** ou **yarn**
- **Expo Go** sur ton téléphone (disponible sur App Store / Google Play)

### 17.2 Installation

```bash
# 1. Cloner le projet (si pas déjà fait)
git clone [url-du-repo]

# 2. Aller dans le dossier
cd ProjetReactCross-main

# 3. Installer les dépendances
npm install

# 4. Lancer l'application
npx expo start
```

### 17.3 Tester l'Application

1. Scanner le QR code avec Expo Go (Android) ou l'app Caméra (iOS)
2. Se connecter avec les comptes de test :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Patient | jean@patient.fr | patient123 |
| Pharmacien | marie@pharmacie.fr | pharmacien123 |

### 17.4 Structure des Fichiers Clés

```
📁 src/
├── 📁 api/                    # Services de données
│   ├── asyncStorage.ts       # Fonctions de stockage
│   ├── medicamentService.ts  # CRUD médicaments + validations
│   ├── commandeService.ts    # CRUD commandes
│   └── ordonnanceService.ts  # CRUD ordonnances
│
├── 📁 store/                  # État global (Zustand)
│   ├── authStore.ts          # Authentification
│   ├── commandeStore.ts      # Gestion commandes + stock
│   └── medicamentStore.ts    # Gestion médicaments
│
├── 📁 screens/                # Écrans de l'app
│   ├── auth/LoginScreen.tsx  # Connexion
│   ├── patient/              # Écrans patient
│   └── pharmacien/           # Écrans pharmacien
│
└── 📁 utils/
    └── seedData.ts           # Données de test initiales
```

---

## 🎓 Conclusion

Tu as maintenant une compréhension **COMPLÈTE** de l'application ! Voici un résumé :

### Technologies
- **React Native + Expo** = Framework pour créer des apps mobiles cross-platform
- **TypeScript** = JavaScript avec des types pour éviter les erreurs
- **Navigation** = Stack (empiler) + Tabs (onglets)
- **Zustand** = Gestion de l'état global simple et efficace
- **AsyncStorage** = Stockage local persistant des données

### Architecture
- **Architecture en couches** = UI → State → Services → Storage
- Séparation claire des responsabilités
- Code maintenable et testable

### Validations Métier
- Protection des médicaments contre les suppressions dangereuses
- Validation complète avant création de commande
- Gestion intelligente du stock selon les statuts
- Indicateurs visuels pour guider l'utilisateur

### Points Forts de l'Application
1. ✅ Données persistantes entre les sessions
2. ✅ Validations robustes côté métier
3. ✅ Gestion du stock automatique
4. ✅ Interface utilisateur intuitive avec alertes visuelles
5. ✅ Code TypeScript typé et maintenable

**Bonne chance pour ta présentation ! 🚀**

---

*Document mis à jour le 4 décembre 2024*
*Projet Santé Connect - Gestion d'Ordonnances Médicales*
