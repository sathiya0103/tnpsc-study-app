import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { initDatabase } from './src/services/databaseService';
import { setupNotifications, scheduleFallbackReminder } from './src/services/notificationService';
import './src/localization/i18n';

export default function App() {
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        initDatabase()
            .then(async () => {
                await setupNotifications();
                await scheduleFallbackReminder();
                setDbReady(true);
            })
            .catch((e) => {
                console.warn('DB init error:', e);
                setDbReady(true); // still proceed
            });
    }, []);

    if (!dbReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
                <ActivityIndicator size="large" color="#1a237e" />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </ThemeProvider>
    );
}