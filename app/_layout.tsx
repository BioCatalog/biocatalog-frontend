import { router, Slot } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SQLiteProvider } from "expo-sqlite";
import initializeDatabase, { refactorDatabase } from "@/database/initializeDatabase";
import { AuthProvider, useAuth } from "@/context/auth";
import { useEffect } from "react";
import "@/global.css";
import { StatusBar } from "react-native";

export default function Layout() {
    const auth = useAuth();

    useEffect(() => { if (auth.isLogged) return router.replace('/main/(tabs)'); }, []);

    return (
        <GluestackUIProvider>
            <SQLiteProvider databaseName="biocatalog.db" onInit={initializeDatabase}>
                <AuthProvider>
                    <StatusBar animated={true} backgroundColor='#083E03' barStyle={"dark-content"} hidden />
                    <Slot />
                </AuthProvider>
            </SQLiteProvider>
        </GluestackUIProvider>
    )
}