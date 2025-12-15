import { Text, View, SafeAreaView, showToast, Button } from '@/components'
import { Image } from "expo-image";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"
import logo from "@/assets/images/logo.png";
import { TouchableOpacity } from 'react-native'
import { useColors } from "@/hooks/useColors";
import Octicons from '@expo/vector-icons/Octicons';
import { useAuthStore } from "@/utils/auth-store";
import { ModalConfirm } from '@/components/ui/modals/ModalConfirm'
import { ModalLoading } from '@/components/ui/modals/ModalLoading'
import { formatPHNumber } from '@/utils/format-ph-number'

export default function OTPPage() {
  const [pin, setPin] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfrim, setShowConfirm] = useState(false);
  const { login, setPhoneNumber, phoneNumber, visitor, getSession } = useAuthStore();
  const colors = useColors();
  const handlePress = async (num: string) => {
    if (pin.length >= 6) return;

    const updatedPin = [...pin, num];
    setPin(updatedPin);

    if (updatedPin.length === 6) {
      try {
        setLoading(true);
        
      } catch (error) {
        showToast({
          type: 'error',
          text1: 'Login Failed',
          text2: error.response ? error.response.data.message : "Something went wrong, try again later"
        });
        setPin([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
      <ModalLoading visible={loading} />

      <View style={{ marginTop: 80, marginHorizontal: 12, gap: 10 }}>
        <Text type="bold" style={{
          color: colors.text,
          fontSize: 22
        }}>Verify Your Account</Text>
        <Text>Please enter the One Time Pin (OTP) we've sent to your phone number <Text type="link">(+63) {formatPHNumber(visitor?.phone_number)}</Text>.</Text>
      </View>

      <View style={{
        alignItems: 'center',
        marginBottom: 60
      }}>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 40 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={{
                width: 40,
                height: 44,
                borderBottomWidth: 2,
                borderColor: i < pin.length ? colors.primary : colors.border,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
            <Text style={{
              fontSize: 24
            }}>{pin[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{
        flex: 1,
        justifyContent: "center",
        gap: 25
      }}>
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["", "0", "back"]
        ].map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            {row.map((item, index) => {
              if (item === "") return <View key={index} style={{ width: 70 }} />;

              if (item === "back") {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={handleBackspace}
                    activeOpacity={0.8}
                    style={{
                      width: 70,
                      height: 70,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="backspace-outline" size={36} color={colors.text} />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.8}
                  style={{
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 32, color: colors.text }}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

    </SafeAreaView>
  );
}
