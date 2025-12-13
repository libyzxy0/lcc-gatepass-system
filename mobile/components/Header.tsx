import React, { useState } from 'react';
import { Text, View } from '@/components'
import { useColors } from '@/hooks/useColors'
import { useAuthStore } from '@/utils/auth-store'
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import logo from "@/assets/images/logo.png";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ModalDestructive } from '@/components/ui/modals/ModalDestructive'
export function Header() {
  const colors = useColors();
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuthStore();
  return (
    <>
      <ModalDestructive
        visible={showLogout}
        onConfirm={logout}
        onClose={() => setShowLogout(false)}
        title={"Logout"}
        description={"Are you sure you want to logout?"}
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
        <TouchableOpacity onPress={() => setShowLogout(true)} activeOpacity={0.8}>
          <Ionicons name="exit-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </>
  )
}