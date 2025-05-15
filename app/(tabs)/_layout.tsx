import { HapticTab } from '@/components/HapticTab';
import { MenuIcon, SettingsIcon } from '@/components/ui';
import { useThemeStore } from '@/stores/themeStore';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import colors from 'tailwindcss/colors';

export default function TabLayout() {
    const { isDark } = useThemeStore();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: isDark ? colors.blue[400] : colors.blue[600],
                tabBarInactiveTintColor: isDark ? colors.gray[400] : colors.gray[600],
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                        backgroundColor: isDark ? colors.black[950] : colors.white,
                        height: 60,
                    },
                    default: {
                        backgroundColor: isDark ? colors.black[950] : colors.white,
                        paddingBottom: 0,
                        height: 60,
                    },
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'My list',
                    tabBarIcon: ({ color }) => <MenuIcon color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <SettingsIcon color={color} fill="transparent" />,
                }}
            />
        </Tabs>
    );
}
