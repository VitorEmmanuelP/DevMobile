import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
        {children}
        </SafeAreaView>
    </SafeAreaProvider>
  );
}