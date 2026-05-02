import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from './src/context/AppContext';
import { COLORS, getThemeColors } from './src/theme/colors';

import { LandingScreen } from './src/screens/LandingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { CreateAccountScreen } from './src/screens/CreateAccountScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { ForYouScreen } from './src/screens/ForYouScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AccountSettingsScreen } from './src/screens/AccountSettingsScreen';
import { DietaryPreferencesScreen } from './src/screens/DietaryPreferencesScreen';
import { FavoritedScreen } from './src/screens/FavoritedScreen';
import { AccessibilityScreen } from './src/screens/AccessibilityScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileStack = createStackNavigator();
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <ProfileStack.Screen name="DietaryPreferences" component={DietaryPreferencesScreen} />
      <ProfileStack.Screen name="Favorites" component={FavoritedScreen} />
      <ProfileStack.Screen name="Accessibility" component={AccessibilityScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  const { darkMode, t } = useApp();
  const theme = getThemeColors(darkMode);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Explore: focused ? 'search' : 'search-outline',
            ForYou: focused ? 'star' : 'star-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={20} color={color} />;
        },
        tabBarActiveTintColor: COLORS.maroon,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.cardBg,
          borderTopColor: theme.border,
          height: 60,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarLabel: t('explore') }}
      />
      <Tab.Screen
        name="ForYou"
        component={ForYouScreen}
        options={{ tabBarLabel: t('forYou') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: t('profile') }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
