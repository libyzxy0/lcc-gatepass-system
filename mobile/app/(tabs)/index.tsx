import React, { useState, useEffect, useRef } from "react";
import { Text, View, SafeAreaView } from "@/components";
import { Header } from "@/components/Header";
import { useColors } from "@/hooks/useColors";
import { VisitCard } from "@/components/VisitCard";
import { FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { CreateVisitFloatingButton } from "@/components/CreateVisitFloatingButton";
import { useRouter } from 'expo-router'
import BottomSheet from "@gorhom/bottom-sheet";
import {
  RequestGatepassSheet
} from '@/components/RequestGatepassSheet'
import { useGatepassStore } from '@/utils/gatepass-store'
import { Empty } from '@/components/Empty'

export default function Main() {
  const colors = useColors();
  const [createModal, showCreateModal] = useState(false);

  const router = useRouter();
  const requestGatepassSheetRef = useRef<BottomSheet>(null);

  const { fetching, gatepass, fetchGatepass } = useGatepassStore();

  useEffect(() => {
    fetchGatepass(true);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <Header />
      <View
        style={{
          marginHorizontal: 20,
          flex: 1
        }}
      >
        {!fetching ? (
          <>
            {!fetching && gatepass.length === 0 ? (
              <Empty />
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <Text type="semibold">My Gatepass</Text>
                }
                ListHeaderComponentStyle={{
                  marginVertical: 12
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={fetching}
                    onRefresh={fetchGatepass}
                    colors={[
                      colors.primary,
                      colors.success,
                      colors.warning,
                      colors.danger
                    ]}
                  />
                }
                contentContainerStyle={{
                  gap: 12,
                  paddingBottom: 20
                }}
                data={gatepass}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <VisitCard
                    {...item}
                  />
                )}
              />)}
          </>
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
          onPress={() => requestGatepassSheetRef.current?.snapToIndex(1)}
        />
      </View>
      <RequestGatepassSheet ref={requestGatepassSheetRef} />
    </SafeAreaView>
  );
}
