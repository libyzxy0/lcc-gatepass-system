import React, { useState } from 'react';
import { Text, View, Button } from '@/components'
import { useColors } from '@/hooks/useColors'
import { useAuthStore } from '@/utils/auth-store'
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import logo from "@/assets/images/logo.png";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ModalDestructive } from '@/components/ui/modals/ModalDestructive'
import { useRouter } from 'expo-router'

export function Header() {
  const colors = useColors();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuthStore();
  return (
    <>
      <ModalDestructive
        visible={showLogout}
        onConfirm={logout}
        onClose={() => setShowLogout(false)}
        title={"Logout"}
        description={"Are you sure you want to logout? You will re-enter your pin again to login!"}
        buttonLabel={"Logout"}
        closeAfterConfirm />
      <View style={{
        paddingLeft: 12,
        paddingRight: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Image
          source={logo}
          style={{
            width: 160,
            height: 45
          }}
          contentFit="fill"
        />
        <TouchableOpacity onPress={() => setShowLogout(true)} activeOpacity={0.6}>
          <Ionicons name="exit-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </>
  )
}

export function HeaderNav({ label }: { label: string; }) {
  const colors = useColors();
  const router = useRouter();
  return (
    <View style={{
      paddingHorizontal: 12,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    }}>
      <Button variant={'icon'} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Button>
      <Text type="semibold">{label}</Text>
    </View>
  )
}