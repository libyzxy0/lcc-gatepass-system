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
import { useColorScheme } from "@/hooks/useColorScheme";

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
          text1: "Ohh No, Something went wrong",
          text2: 'An error occurred while verifying phone number',
        });
        return;
      }

      if (isValidNumber.valid) {
        setPhoneNumber(phone);
      } else {
        router.push(`/register/${phone}`);
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
    <SafeAreaView>
      <View
        style={{
          marginTop: 20,
          alignItems: "center",
          gap: 20
        }}
      >
        <Image
          source={logo}
          style={{
            width: 250,
            height: 100
          }}
          contentFit="contain"
          tintColor={useColorScheme() === "dark" && 'white'}
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
          marginTop: 60,
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
              onChangeText={value =>
                setPhone(value)
              }
              value={phone ?? undefined}
              cursorColor={colors.primary}
              textContentType={"telephoneNumber"}
              keyboardType={"numeric"}
              autoCorrect={false}
              inputMode={"numeric"}
              autoComplete={"tel"}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 14,
                borderRadius: 10,
                flex: 1
              }}
              placeholder="Enter Mobile Number (e.g.: 9937793944)"
            />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 5
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
            {loading ? "Loading..." : "Continue"}
          </Button>
        </View>

        <View
          style={{
            marginTop: 28,
            gap: 120,
            alignItems: "center"
          }}
        >
          <Text
            type="secondary"
            style={{
              fontSize: 12,
              textAlign: 'center'
            }}
          >
            © Copyright 2025, LCC-ICT-RP Group 2 All rights reserved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
