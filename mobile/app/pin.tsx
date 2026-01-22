import { Text, View, SafeAreaView, showToast, Button } from '@/components'
import { Image } from "expo-image";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"
import logo from "@/assets/images/logo.png";
import waveBorder from "@/assets/images/wave-border.svg";
import { TouchableOpacity } from 'react-native'
import { useColors } from "@/hooks/useColors";
import Octicons from '@expo/vector-icons/Octicons';
import { useAuthStore } from "@/utils/auth-store";
import { ModalConfirm } from '@/components/ui/modals/ModalConfirm'
import { ModalLoading } from '@/components/ui/modals/ModalLoading'
import { formatPHNumber } from '@/utils/format-ph-number'
import { useColorScheme } from "@/hooks/useColorScheme";

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
          text1: "Ohh No! There's an Error!",
          text2: error.response ? error.response.data.error : "Maybe the server is busy or sleeping 😅"
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ModalLoading visible={loading} />
      <ModalConfirm
        visible={showConfrim}
        onConfirm={() => setPhoneNumber(null)}
        onClose={() => setShowConfirm(false)}
        title={"Change Number?"}
        description={"Are you sure you want to change your number to login?"} closeAfterConfirm />

      <View style={{
        alignItems: "center",
        marginTop: 30,
      }}>

        <Image
          source={logo}
          style={{ width: 250, height: 100 }}
          contentFit="contain"
        />
        <Text type="bold" style={{
          color: colors.text,
          fontSize: 22
        }}>Enter your PIN</Text>

        <View style={{ flexDirection: "row", gap: 20, marginTop: 25 }}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                width: 15,
                height: 15,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: colors.text,
                backgroundColor: i < pin.length ? colors.text : "transparent",
              }}
            />
          ))}
        </View>

        <View style={{
          alignItems: 'center',
          marginTop: 30,
        }}>
          <TouchableOpacity onPress={() => setShowConfirm(true)} activeOpacity={0.8} style={{
            backgroundColor: colors.backgroundPinScreen,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 50,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            shadowColor: colors.primary + '5A',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: 1,
            elevation: 5,
            borderWidth: 1,
            borderColor: colors.border
          }}>
            <Text type="bold" style={{
              color: 'white',
              fontSize: 16
            }}>(+63) {formatPHNumber(phoneNumber)}</Text>
            <Octicons name="arrow-switch" size={16} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
      }}>
        <Image source={waveBorder} style={{
          height: 100,
          width: '100%',
        }} />
        <View style={{
          justifyContent: "center",
          gap: 14,
          backgroundColor: colors.backgroundPinScreen,
          paddingHorizontal: 14,
          paddingBottom: 25,
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
                      <Ionicons name="backspace-outline" size={34} color={'white'} />
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
                    <Text type="bold" style={{ fontSize: 32, color: 'white' }}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          <View style={{
            alignItems: 'center'
          }}>
            <Text style={{
              color: '#a7a7a7',
              fontSize: 12
            }}>Project made possible by ICT-12A All Things Tech.</Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}
