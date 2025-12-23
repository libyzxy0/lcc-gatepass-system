import { Text, View, SafeAreaView, showToast, Button } from '@/components'
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons"
import logo from "@/assets/images/logo.png";
import { TouchableOpacity } from 'react-native'
import { useColors } from "@/hooks/useColors";
import Octicons from '@expo/vector-icons/Octicons';
import { useAuthStore } from "@/utils/auth-store";
import { ModalConfirm } from '@/components/ui/modals/ModalConfirm'
import { ModalLoading } from '@/components/ui/modals/ModalLoading'
import { formatPHNumber } from '@/utils/format-ph-number'
import { generateOTP, verifyOTP } from '@/api/helper/otp'
import { useRouter } from 'expo-router';

export default function OTPPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfrim, setShowConfirm] = useState(false);
  const { login, phoneNumber, setPhoneNumber, getSession } = useAuthStore();
  const colors = useColors();
  const [sent, setSent] = useState(false);
  const [time, setTime] = useState(5 * 60);

  useEffect(() => {
    if (time === 0) return;

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handlePress = async (num: string) => {
    if (pin.length >= 6) return;

    const updatedPin = [...pin, num];
    setPin(updatedPin);

    if (updatedPin.length === 6) {
      try {
        setLoading(true);
        const data = await verifyOTP(phoneNumber, updatedPin.join(""))
        if (data?.server_error) {
          showToast({
            type: 'error',
            text1: "Ohh No! There's an Error!",
            text2: data.message
          });
          setPin([]);
          return;
        }
        if (data.verified === true) {
          showToast({
            type: 'success',
            text1: 'Account Successfully activated!',
            text2: data.message
          });
          await getSession();
          router.replace('/');
          setPin([]);
        } else {
          showToast({
            type: 'error',
            text1: "Ohh No! There's an Error!",
            text2: data.message
          });
          setPin([]);
        }

      } catch (error) {
        showToast({
          type: 'error',
          text1: "Ohh No! There's an Error!",
          text2: error.response ? error.response.data.message : "Maybe the server is busy or sleeping 😅"
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

  useEffect(() => {
    if (!sent) {
      const sendOTP = async () => {
        await generateOTP(phoneNumber);
      }
      sendOTP();
      setSent(true);
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
      <ModalLoading visible={loading} />
      <ModalConfirm
        visible={showConfrim}
        onConfirm={() => setPhoneNumber(null)}
        onClose={() => setShowConfirm(false)}
        title={"Change Number?"}
        description={"Are you sure you want to change your number to login?"} closeAfterConfirm />
      <View style={{ marginTop: 80, marginHorizontal: 12, gap: 10 }}>
        <Text type="bold" style={{
          color: colors.text,
          fontSize: 22
        }}>Enter your One Time Pin (OTP)</Text>
        <Text>Please enter the One Time Pin (OTP) we've sent to your phone number <Text onPress={() => setShowConfirm(true)} type="link">(+63) {formatPHNumber(phoneNumber)}</Text>.</Text>
      </View>

      <View style={{
        alignItems: 'center',
        marginBottom: 20
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
        justifyContent: 'center',
        marginBottom: 20
      }}>
        <Text type={'secondary'} style={{
          textAlign: 'center'
        }}>Resend after {minutes}:{seconds}</Text>
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
