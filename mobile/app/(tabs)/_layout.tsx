import React from "react";
import Octicons from '@expo/vector-icons/Octicons';
import { Link, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
    const colors = useColors();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                headerShown: false,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute"
                    },
                    default: {
                        backgroundColor: colors.background,
                        borderColor: colors.border
                    }
                }),
                tabBarLabelStyle: {
                    fontFamily: "Nunito"
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Gatepass",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Octicons size={22} style={{ marginBottom: -3, color }} name={'id-badge'} />
                    )
                }}
            />
            <Tabs.Screen
                name="me"
                options={{
                    title: "Me",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Octicons size={22} style={{ marginBottom: -3, color }} name={'person'} />
                    )
                }}
            />
        </Tabs>
    );
}
