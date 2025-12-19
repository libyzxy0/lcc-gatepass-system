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

export default function Pin() {
  const [pin, setPin] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfrim, setShowConfirm] = useState(false);
  const { login, setPhoneNumber, phoneNumber, visitor, getSession } = useAuthStore();
  const colors = useColors();
  const handlePress = async (num: string) => {
    if (pin.length >= 4) return;

    const updatedPin = [...pin, num];
    setPin(updatedPin);

    if (updatedPin.length === 4) {
      try {
        setLoading(true);
        await login(updatedPin.join(""));
      } catch (error) {
        showToast({
          type: 'error',
          text1: 'Login Failed',
          text2: error.response ? error.response.data.error : "Something went wrong, try again later"
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
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: colors.backgroundPinScreen }}>
      <ModalLoading visible={loading} />
      <ModalConfirm
        visible={showConfrim}
        onConfirm={() => setPhoneNumber(null)}
        onClose={() => setShowConfirm(false)}
        title={"Change Number?"}
        description={"Are you sure you want to change your number to login?"} closeAfterConfirm />
      <View style={{ marginTop: 30, alignItems: "center", gap: 20 }}>
        <Image
          source={logo}
          style={{ width: 250, height: 100 }}
          contentFit="contain"
          tintColor={"white"}
        />
        <Text type="bold" style={{
          color: "white",
          fontSize: 22
        }}>Enter your PIN</Text>

        <View style={{ flexDirection: "row", gap: 15, marginTop: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                width: 15,
                height: 15,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: "white",
                backgroundColor: i < pin.length ? "white" : "transparent",
              }}
            />
          ))}
        </View>
      </View>

      <View style={{
        alignItems: 'center',
        marginTop: 50
      }}>
        <TouchableOpacity onPress={() => setShowConfirm(true)} activeOpacity={0.8} style={{
          backgroundColor: colors.backgroundPinScreen,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 50,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.25,
          shadowRadius: 1,
          elevation: 5,
          borderWidth: 1,
          borderColor: colors.primary + '0A'
        }}>
          <Text style={{
            color: 'white'
          }}>(+63) {formatPHNumber(phoneNumber)}</Text>
          <Octicons name="arrow-switch" size={16} color={"white"} />
        </TouchableOpacity>
      </View>

      <View style={{
        flex: 1,
        justifyContent: "center",
        gap: 25,
        marginTop: 10
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
                    <Ionicons name="backspace-outline" size={36} color={"white"} />
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
                  <Text style={{ fontSize: 32, color: "white" }}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={{
          alignItems: 'center'
        }}>
          <Text style={{
            color: 'white'
          }}>Project made possible by ICT-12A Group 2.</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}
