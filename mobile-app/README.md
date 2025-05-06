# Loandify Mobile App

This is the mobile application for Loandify, a loan aggregator platform that allows users to apply for personal loans, view offers from multiple lenders, and manage their loan dashboard.

## Features

- **Apply for Loans**: Complete a loan application with document OCR support
- **View Offers**: See personalized loan offers from multiple lenders
- **Dashboard**: View active loans and payment schedules
- **Profile Management**: Manage personal information and settings
- **Loyalty Program**: Earn and redeem points for loan applications and referrals

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Paper
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
2. Navigate to the mobile-app directory
3. Install dependencies

```bash
cd mobile-app
npm install
```

### Running the App

To start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools in your browser. From there, you can:

- Run on an iOS simulator (macOS only)
- Run on an Android emulator
- Scan the QR code with the Expo Go app on your physical device

## Project Structure

```
mobile-app/
├── App.tsx                # Main app component
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── ApplyScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── OffersScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/        # Reusable UI components
│   ├── services/          # API and business logic
│   ├── navigation/        # Navigation configuration
│   └── utils/             # Helper functions
├── assets/                # Images, fonts, etc.
└── package.json           # Dependencies and scripts
```

## OCR Document Processing

The mobile app includes document OCR functionality for streamlining the loan application process:

- Users can upload identity documents (NRIC/Passport)
- Users can upload income verification documents (Payslips, CPF statements)
- OCR extracts relevant information to auto-fill application forms
- Extracted data is verified and can be manually corrected if needed

## Real-time Notifications

The app receives real-time notifications about:

- Loan application status updates
- New loan offers
- Payment reminders
- Document verification status

## Build for Production

To build a standalone app:

```bash
expo build:android  # For Android APK/AAB
expo build:ios      # For iOS IPA (requires Apple Developer account)
```

## How It Connects to the Web Platform

This mobile app serves as a companion to the Loandify web platform, sharing the same backend services and data. Users can seamlessly switch between web and mobile as their account and loan information is synchronized. 