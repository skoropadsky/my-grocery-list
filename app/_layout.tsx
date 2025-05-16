import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { useThemeStore } from '@/stores/themeStore';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

function AppContent() {
    const { themeMode } = useThemeStore();

    return (
        <GluestackUIProvider mode={themeMode}>
            <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-black">
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false, title: 'My list' }}
                    />
                    <Stack.Screen
                        name="edit"
                        options={{
                            headerShown: true,
                            title: 'Edit item',
                            headerStyle: { backgroundColor: 'bg-white dark:bg-black' },
                            headerTintColor: 'bg-white dark:bg-black',
                        }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
            </SafeAreaView>
        </GluestackUIProvider>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <QueryProvider>
            <AppContent />
        </QueryProvider>
    );
}
