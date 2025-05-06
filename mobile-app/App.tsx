import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ApplyScreen from './src/screens/ApplyScreen';
import OffersScreen from './src/screens/OffersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoanCalculatorScreen from './src/screens/LoanCalculatorScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

// Navigation types
type RootStackParamList = {
  Main: undefined;
  Apply: undefined;
  Offers: undefined;
  LoanCalculator: undefined;
  Notifications: undefined;
};

type TabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Calculator: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0051CC',
    accent: '#4C9AFF',
  },
};

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Calculator') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen 
        name="Calculator" 
        component={LoanCalculatorScreen} 
        options={{ title: 'Loan Calculator' }}
      />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="Apply" 
              component={ApplyScreen} 
              options={{ 
                headerShown: true,
                title: 'Loan Application'
              }} 
            />
            <Stack.Screen 
              name="Offers" 
              component={OffersScreen} 
              options={{ 
                headerShown: true,
                title: 'Your Loan Offers'
              }} 
            />
            <Stack.Screen 
              name="LoanCalculator" 
              component={LoanCalculatorScreen} 
              options={{ 
                headerShown: true,
                title: 'Advanced Loan Calculator'
              }} 
            />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen} 
              options={{ 
                headerShown: true,
                title: 'Notifications'
              }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 