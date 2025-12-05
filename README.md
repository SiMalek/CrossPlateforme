# 🏥 Santé Connect - Medical Prescription Management System

A modern, cross-platform mobile application for managing medical prescriptions, built with React Native and Expo. This application connects patients with pharmacists, streamlining the prescription fulfillment process.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### 👤 Patient Features
- **View Prescriptions**: Browse all medical prescriptions with detailed medication information
- **Create Orders**: Order medications from prescriptions with a single tap
- **Track Orders**: Monitor order status in real-time (Pending → In Preparation → Ready → Picked Up)
- **Return Orders**: Request returns for orders with pharmacist approval
- **Order Details**: View comprehensive order information including medications and quantities

### 💊 Pharmacist Features
- **Manage Inventory**: Full CRUD operations for medication stock
  - Add new medications with dosage, form, and manufacturer details
  - Edit existing medication information
  - Delete medications with confirmation
  - Search and filter medications
- **Process Orders**: Update order status through the fulfillment workflow
- **Stock Management**: Automatic stock deduction when orders are marked as ready
- **Order Management**: View and manage all incoming orders from patients

### 🎨 UI/UX Highlights
- **Premium Design**: Sophisticated gradients, glassmorphism effects, and smooth animations
- **Modern Color System**: Carefully crafted color palette with semantic colors
- **Responsive**: Works seamlessly on iOS and Android devices
- **Intuitive Navigation**: Tab-based navigation with stack navigators for detailed views
- **Real-time Feedback**: Loading states, error handling, and success notifications

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo Go** app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gharsallah-Islem/Sant-Connect.git
   cd Sant-Connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or with cache cleared
   npx expo start --clear
   ```

4. **Run on your device**
   - Scan the QR code with **Expo Go** (Android) or **Camera** app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator, `w` for web

## 📱 Test Accounts

### Patient Account
- **Email**: `jean@patient.fr`
- **Password**: `patient123`
- **Role**: Patient

### Pharmacist Account
- **Email**: `marie@pharmacie.fr`
- **Password**: `pharmacien123`
- **Role**: Pharmacien

## 🏗️ Project Structure

```
projet/
├── src/
│   ├── api/                    # API services and data layer
│   │   ├── asyncStorage.ts     # Local storage utilities
│   │   ├── commandeService.ts  # Order management
│   │   ├── medicamentService.ts # Medication management
│   │   ├── ordonnanceService.ts # Prescription management
│   │   ├── userService.ts      # User authentication
│   │   └── initializeData.ts   # Initial data seeding
│   ├── navigation/             # Navigation configuration
│   │   ├── AppNavigator.tsx    # Root navigator
│   │   ├── AuthNavigator.tsx   # Authentication flow
│   │   ├── PatientNavigator.tsx # Patient tab navigation
│   │   ├── PharmacienNavigator.tsx # Pharmacist tab navigation
│   │   └── ...                 # Stack navigators
│   ├── screens/                # Screen components
│   │   ├── auth/               # Login/authentication screens
│   │   ├── patient/            # Patient-specific screens
│   │   └── pharmacien/         # Pharmacist-specific screens
│   ├── store/                  # Zustand state management
│   │   ├── authStore.ts        # Authentication state
│   │   ├── commandeStore.ts    # Order state
│   │   ├── medicamentStore.ts  # Medication state
│   │   └── ordonnanceStore.ts  # Prescription state
│   ├── theme/                  # Design system
│   │   ├── colors.ts           # Color palette
│   │   ├── spacing.ts          # Spacing scale
│   │   └── typography.ts       # Typography system
│   └── types/                  # TypeScript type definitions
├── App.tsx                     # Application entry point
└── package.json                # Dependencies
```

## 🛠️ Tech Stack

### Core
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript

### Navigation
- **@react-navigation/native** - Navigation library
- **@react-navigation/bottom-tabs** - Tab navigation
- **@react-navigation/native-stack** - Stack navigation

### State Management
- **Zustand** - Lightweight state management

### UI Components
- **expo-linear-gradient** - Gradient backgrounds
- **@expo/vector-icons** - Icon library
- **react-native-reanimated** - Smooth animations

### Storage
- **@react-native-async-storage/async-storage** - Local data persistence

## 📊 Data Flow

### Order Lifecycle
```
Patient creates order → EN_ATTENTE (Pending)
                     ↓
Pharmacist accepts → EN_PREPARATION (In Preparation)
                     ↓
Pharmacist prepares → PRETE (Ready) [Stock decreases automatically]
                     ↓
Patient picks up → RECUPEREE (Picked Up)
                     ↓
Patient returns → RETOURNEE (Returned) [Pending pharmacist approval]
```

### Stock Management
- **Automatic Deduction**: When order status changes to `PRETE`, stock is automatically decreased
- **Calculation**: `Total Quantity = Daily Quantity × Duration (days)`
- **Return Flow**: Stock can be restored when pharmacist approves a return

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 → #8B5CF6 → #A855F7)
- **Secondary**: Violet to Pink gradient
- **Accent**: Teal to Cyan gradient
- **Semantic Colors**: Success (green), Warning (orange), Danger (red)

### Typography
- **Font Families**: System default with weight variants
- **Scale**: xs (12px) → 5xl (48px)
- **Weights**: Regular (400) → Bold (700)

### Spacing
- **Scale**: xs (4px) → 5xl (64px)
- **Consistent**: Used throughout for margins, padding, and gaps

## 🔒 Security Notes

⚠️ **Important**: This is a development/educational project. For production use:
- Implement proper backend authentication (JWT, OAuth)
- Use secure API endpoints instead of local storage
- Add input validation and sanitization
- Implement rate limiting
- Use HTTPS for all communications
- Add proper error logging and monitoring

## 🐛 Known Issues

- Logout button visibility on some mobile devices (being addressed)
- Stock restoration on return approval (pending implementation)
- Order history filtering (planned feature)

## 🚧 Roadmap

- [ ] Backend API integration
- [ ] Push notifications for order status changes
- [ ] QR code scanning for prescriptions
- [ ] Multi-pharmacy support
- [ ] Advanced search and filtering
- [ ] Analytics dashboard for pharmacists
- [ ] Prescription renewal requests
- [ ] In-app messaging between patients and pharmacists

## 🤝 Contributing

This is an educational project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic project (PFE - Projet de Fin d'Études).

## 👥 Authors

- **Islem Gharsallah** - [GitHub](https://github.com/Gharsallah-Islem)

## 🙏 Acknowledgments

- React Native and Expo communities
- Design inspiration from modern healthcare applications
- French medication database for realistic test data

---

**Made with ❤️ for better healthcare management**"# ProjetReactCross" 
