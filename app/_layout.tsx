import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GluestackUIProvider mode="system">
                <SafeAreaView style={{ flex: 1 }}>
                    {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false, title: 'My list' }}
                        />
                        <Stack.Screen
                            name="edit"
                            options={{ headerShown: true, title: 'Edit item' }}
                        />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                    {/* </ThemeProvider> */}
                </SafeAreaView>
            </GluestackUIProvider>
        </QueryClientProvider>
    );
}
