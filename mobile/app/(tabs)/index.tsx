import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView } from "@/components";
import { Header } from "@/components/Header";
import { useColors } from "@/hooks/useColors";
import { VisitCard } from "@/components/VisitCard";
import { FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { CreateNewVisit } from "@/components/CreateNewVisit";
import { ModalDestructive } from "@/components/ui/modals/ModalDestructive";
import { useVisits } from "@/hooks/useVisits";
import { CreateVisitFloatingButton } from "@/components/CreateVisitFloatingButton";

export default function Main() {
    const colors = useColors();
    const [createModal, showCreateModal] = useState(false);
    const [deleteModal, showDeleteModal] = useState<{
        state: boolean;
        value: string | null;
    }>({
        state: false,
        value: null
    });

    const { fetching, visits, fetchVisits, deleteVisit } = useVisits();

    return (
        <SafeAreaView
            style={{
                flex: 1
            }}
        >
            <Header />
            <CreateNewVisit
                visible={createModal}
                onClose={() => showCreateModal(false)}
                onCreate={fetchVisits}
            />
            <ModalDestructive
                visible={deleteModal.state}
                onConfirm={() => {
                    deleteVisit(deleteModal.value);
                    showDeleteModal({
                        state: false,
                        value: null
                    });
                }}
                description={'Are you sure that you want to delete this gatepass? This will revoke your gatepass!'}
                onClose={() =>
                    showDeleteModal({
                        state: false,
                        value: null
                    })
                }
            />

            <View
                style={{
                    marginHorizontal: 20,
                    flex: 1
                }}
            >
                {!fetching ? (
                    <FlatList
                        ListHeaderComponent={
                            <Text type="semibold">My Gatepass</Text>
                        }
                        ListHeaderComponentStyle={{
                            marginVertical: 12
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={fetching}
                                onRefresh={fetchVisits}
                                colors={[
                                    colors.primary,
                                    colors.success,
                                    colors.warning,
                                    colors.danger
                                ]}
                            />
                        }
                        contentContainerStyle={{
                            gap: 8,
                            paddingBottom: 20
                        }}
                        data={visits}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <VisitCard
                                id={item.id}
                                purpose={item.purpose}
                                description={item.description}
                                visiting={item.visiting}
                                status={item.status}
                                secured={item.secured}
                                date={item.schedule_date}
                                onDelete={() =>
                                    showDeleteModal({
                                        state: true,
                                        value: item.id
                                    })
                                }
                            />
                        )}
                    />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12
                        }}
                    >
                        <ActivityIndicator
                            size="large"
                            color={colors.primary}
                        />
                        <Text type="secondary">Loading pre wait</Text>
                    </View>
                )}
                <CreateVisitFloatingButton
                    onPress={() => showCreateModal(true)}
                />
            </View>
        </SafeAreaView>
    );
}
