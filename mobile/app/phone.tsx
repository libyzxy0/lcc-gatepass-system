import {
  Text,
  View,
  Button,
  Input,
  SafeAreaView,
  showToast,
  Link
} from "@/components";
import { Image } from "expo-image";
import logo from "@/assets/images/logo.png";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/utils/auth-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState, useRef } from "react";
import { checkNumber } from '@/api/helper/check-num'
import { useRouter } from 'expo-router'
import { normalize, isValidPHPhoneNumber } from '@/utils/format-ph-number'
import waveBorder from "@/assets/images/wave-border.svg";
import { ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'

export default function PhonePage() {
  const router = useRouter();
  const colors = useColors();
  const { setPhoneNumber } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!phone) {
        showToast({
          type: "warning",
          text1: "Empty Phone Number",
          text2: 'Please enter your mobile number.'
        });
        return;
      }

      if (!isValidPHPhoneNumber(phone)) {
        showToast({
          type: "warning",
          text1: "Invalid Phone Number",
          text2: 'Please enter a valid PH phone number.',
        });
        return;
      }

      const isValidNumber = await checkNumber(normalize(phone));

      if (isValidNumber.isServerError) {
        showToast({
          type: "error",
          text1: "Ohh No! There's an Error!",
          text2: "Maybe the server is busy or sleeping 😅",
        });
        return;
      }

      if (isValidNumber.valid) {
        setPhoneNumber(normalize(phone));
      } else {
        router.push(`/register/${normalize(phone)}`);
      }

    } catch (error: any) {
      showToast({
        type: "error",
        text1: "Ohh No, Something went wrong",
        text2: `${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.backgroundPinScreen
    }}>
      <StatusBar style={'light'} />
      <SafeAreaView style={{
        backgroundColor: 'transparent'
      }}>
        <View style={{
          flex: 1,
          backgroundColor: colors.background
        }}>
          <Image source={waveBorder} style={{
            height: 100,
            width: '100%',
            transform: [{ rotate: '180deg' }]
          }} />
          <View
            style={{
              alignItems: "center",
              gap: 14,
              paddingTop: 10,
            }}
          >
            <Image
              source={logo}
              style={{
                width: 250,
                height: 90
              }}
              contentFit="contain"
            />

            <Text type="bold">Enter Mobile Number</Text>
            <Text type="secondary" style={{
              textAlign: 'center',
              marginHorizontal: 20
            }}>Please enter your mobile number below to continue, we will use it to verify your identity.</Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              marginTop: 40,
              marginHorizontal: 30,
              gap: 14
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                gap: 5
              }}
            >
              <Text>Mobile Number</Text>
              <View style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center'
              }}>
                <Input
                  onChangeText={setPhone}
                  value={phone ?? undefined}
                  cursorColor={colors.primary}
                  textContentType={"telephoneNumber"}
                  keyboardType={"numeric"}
                  autoCorrect={false}
                  inputMode={"numeric"}
                  autoComplete={"tel"}
                  autoFocus={true}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    flex: 1
                  }}
                  placeholder="Enter your mobile number (e.g.: 9937793944)"
                />
              </View>
            </View>

            <View
              style={{
                width: "100%",
                marginTop: 5,
              }}
            >
              <Button
                onPress={handleLogin}
                style={{
                  paddingVertical: 10,
                  alignItems: "center",
                  width: "100%",
                  borderRadius: 10
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size={22} color={'white'} />
                ) : "Continue"}
              </Button>
            </View>


          </View>
          <View
            style={{
              marginHorizontal: 30,
              alignItems: "center",
              marginBottom: 40
            }}
          >
            <Text
              type="secondary"
              style={{
                fontSize: 12,
                textAlign: 'center'
              }}
            >
              © Copyright 2026, La Concepcion College Digital Gatepass System All rights reserved.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
