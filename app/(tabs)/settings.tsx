import { Box, HStack, Switch, Text, VStack } from '@/components/ui';
import { useThemeStore } from '@/stores/themeStore';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
    const { themeMode, setTheme } = useThemeStore();

    const handleThemeChange = (value: boolean) => {
        setTheme(value ? 'dark' : 'light');
    };

    return (
        <Box className="bg-white dark:bg-black flex-1" style={styles.container}>
            <VStack space="lg" className="p-4">
                <Text size="2xl">Settings</Text>
                <HStack space="md" className="items-center justify-between">
                    <Text>Dark Mode</Text>
                    <Switch value={themeMode === 'dark'} onToggle={handleThemeChange} size="md" />
                </HStack>
            </VStack>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
