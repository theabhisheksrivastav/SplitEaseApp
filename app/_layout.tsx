import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { loginUser } from '../app/api';
import { UserProvider, useUser } from '../context/UserContext';

const theme = {
  colors: {
    primary: '#6200EE',
    primaryContainer: '#3700B3',
    secondary: '#03DAC6',
    secondaryContainer: '#018786',
    surface: '#FFFFFF',
    background: '#FFFFFF',
    error: '#B00020',
    onSurface: '#000000',
    onBackground: '#000000',
  },
};

export default function RootLayout() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const { setUser } = useUser();

  useEffect(() => {
    const init = async () => {
      try {
        let androidId: string | null = null;
        if (Platform.OS === 'android') {
          androidId = await Application.getAndroidId?.();
        } else {
          androidId = 'unknown-device-id'; // fallback for iOS / web
        }

        if (!androidId) {
          console.warn('Android ID not found, using fallback');
          androidId = 'fallback-android-id';
        }

        const deviceName =
          Device.deviceName ||
          `${Device.manufacturer ?? ''} ${Device.modelName ?? ''}`.trim() ||
          'unknown';

        const response = await loginUser(androidId, deviceName);
        // assuming loginUser returns { user: { _id: string, androidId: string, deviceName: string } }
        const userId = response.user._id;

        setUser({ userId, androidId, deviceName });
      } catch (err) {
        console.error('Login failed:', err);
      }
    };

    init();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="group/[id]" />
        <Stack.Screen name="add-expense/[groupId]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
