import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_QUERY_KEY = 'themeMode';

async function getStoredTheme(): Promise<ThemeMode> {
    try {
        const savedTheme = await AsyncStorage.getItem(THEME_QUERY_KEY);
        return (savedTheme as ThemeMode) || 'system';
    } catch (error) {
        console.error('Error loading theme:', error);
        return 'system';
    }
}

async function setStoredTheme(mode: ThemeMode): Promise<void> {
    try {
        await AsyncStorage.setItem(THEME_QUERY_KEY, mode);
    } catch (error) {
        console.error('Error saving theme:', error);
    }
}

export function useThemeStore() {
    const systemColorScheme = useColorScheme();
    const queryClient = useQueryClient();

    const { data: themeMode = 'system' } = useQuery({
        queryKey: [THEME_QUERY_KEY],
        queryFn: getStoredTheme,
        staleTime: Infinity,
    });

    const setTheme = async (mode: ThemeMode) => {
        await setStoredTheme(mode);
        queryClient.setQueryData([THEME_QUERY_KEY], mode);
    };

    const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

    return {
        themeMode,
        setTheme,
        isDark,
    };
}
