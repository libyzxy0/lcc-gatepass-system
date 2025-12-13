import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useColors } from "@/hooks/useColors";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
}) {
    return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

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
                        <TabBarIcon name="id-card-outline" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="me"
                options={{
                    title: "Me",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="person-circle-outline" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
