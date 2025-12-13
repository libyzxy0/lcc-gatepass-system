import React, { useState } from 'react'
import { Text, View, SafeAreaView, Button, Link, Input, showToast } from "@/components";
import { ModalConfirm } from '@/components/ui/modals/ModalConfirm'
import { ModalDestructive } from '@/components/ui/modals/ModalDestructive'
import { Header } from '@/components/Header'
import { useColors } from '@/hooks/useColors'
import { ScrollView } from 'react-native'
import Octicons from '@expo/vector-icons/Octicons';

export default function Main() {
  const colors = useColors();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <View style={{
          paddingVertical: 20,
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text type="semibold">My Gatepass</Text>
          <Text type="link">Create New</Text>
        </View>

        <View style={{
          marginHorizontal: 20
        }}>


          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              paddingVertical: 12,
              paddingHorizontal: 14,
              gap: 2
            }}
          >
            <Text
              style={{
                fontSize: 16,
              }}
              type="bold"
            >
              Pay Tuition, Fieldtrip and Uniform
            </Text>


            <Text type="secondary" style={{ fontSize: 12 }}>
              “I want to pay my son's tuition fees, fieldtrip and uniform.”
            </Text>

            <View style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 2
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5
              }}>
                <Text style={{ fontSize: 14, color: colors.primary }}>
                  Cashier
                </Text>
                <View style={{
                  width: 1,
                  height: 10,
                  backgroundColor: colors.border
                }} />
                <Text style={{ fontSize: 14, color: colors.warning }}>
                  Pending
                </Text>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5
              }}>
                <Octicons name="shield-check" size={16} color={colors.success} />
                <Text style={{
                  fontSize: 14,
                  color: colors.success
                }}>Secured Pass</Text>
              </View>
            </View>
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
