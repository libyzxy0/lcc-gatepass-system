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
import React, { useState, useReducer } from "react";
import { ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { visitorRegister } from '@/api/helper/register'
import { useRouter } from 'expo-router'
import { useColorScheme } from "@/hooks/useColorScheme";

type ActionType = {
  type: 'email_change' | 'pin_change' | 'phone_change' | 'firstname_change' | 'lastname_change';
  value: string | null;
}

type CredType = {
  email: string | null;
  password: string | null;
  confirm_password: string | null;
  firstname: string | null;
  lastname: string | null;
}

function reducer(state: CredType, action: ActionType) {
  switch (action.type) {
    case "email_change": {
      return {
        ...state,
        email: action.value
      };
    }
    case "phone_change": {
      return {
        ...state,
        phone_number: action.value
      };
    }
    case "firstname_change": {
      return {
        ...state,
        firstname: action.value
      };
    }
    case "lastname_change": {
      return {
        ...state,
        lastname: action.value
      };
    }
    case "pin_change": {
      return {
        ...state,
        pin: action.value
      };
    }
  }
  throw Error("Unknown action: " + action.type);
}

export default function NewAccountPage() {
  const { phonenum } = useLocalSearchParams<{ phonenum: string }>();
  const colors = useColors();
  const [showPassword, setShowPassword] = useState(false);
  const { login, setPhoneNumber } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    phone_number: phonenum,
    email: null,
    firstname: null,
    lastname: null,
    pin: null,
  });

  const handleCreateAccount = async () => {
    setLoading(true);
    if (!state.firstname) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your firstname.`
      });
      return;
    }
    if (!state.lastname) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your lastname.`
      });
      return;
    }
    if (!state.email) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your email.`
      });
      return;
    }

    if (!state.phone_number) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your phone number.`
      });
      return;
    }

    if (!state.pin) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your desired pin!`
      });
      return;
    }

    const data = await visitorRegister(state);

    if (data && data.success) {
      showToast({
        type: "success",
        text1: "Account Created",
        text2: data.message
      });
      setPhoneNumber(phonenum);
      await login(state.pin);
      router.push('/otp');
    } else {
      showToast({
        type: "error",
        text1: "Failed to create account",
        text2: data.message
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
            gap: 30
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

          <Text type="bold">Create new Account</Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 60,
            marginHorizontal: 30,
            gap: 14,
            marginBottom: 60
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: "4%"
            }}
          >
            <View
              style={{
                width: "48%",
                flexDirection: "column",
                gap: 5
              }}
            >
              <Text>First Name</Text>
              <Input
                onChangeText={value =>
                  dispatch({
                    type: "firstname_change",
                    value
                  })
                }
                value={state.firstname ?? undefined}
                cursorColor={colors.primary}
                textContentType={"givenName"}
                autoCorrect={false}
                autoComplete={"given-name"}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  borderRadius: 10
                }}
                placeholder="Jan Liby"
              />
            </View>

            <View
              style={{
                width: "48%",
                flexDirection: "column",
                gap: 5
              }}
            >
              <Text>Last Name</Text>
              <Input
                onChangeText={value =>
                  dispatch({
                    type: "lastname_change",
                    value
                  })
                }
                value={state.lastname ?? undefined}
                cursorColor={colors.primary}
                textContentType={"familyName"}
                autoCorrect={false}
                autoComplete={"family-name"}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  borderRadius: 10
                }}
                placeholder="Dela Costa"
              />
            </View>
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "column",
              gap: 5
            }}
          >
            <Text>4 Digit Pin</Text>
            <Input
              onChangeText={value => {
                if (value.length <= 4) {
                  dispatch({
                    type: "pin_change",
                    value
                  });
                }
              }}
              value={state.pin ?? undefined}
              cursorColor={colors.primary}
              keyboardType={"numeric"}
              autoCorrect={false}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 14,
                borderRadius: 10,
                color: colors.textSecondary
              }}
              placeholder={"0000"}
            />
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "column",
              gap: 5
            }}
          >
            <Text>Email</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "email_change",
                  value
                })
              }
              value={state.email ?? undefined}
              cursorColor={colors.primary}
              textContentType={"emailAddress"}
              keyboardType={"email_address"}
              autoCorrect={false}
              autoComplete={"email"}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 14,
                borderRadius: 10,
                color: colors.textSecondary
              }}
              placeholder={"janlibydelacosta@gmail.com"}
            />
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "column",
              gap: 5
            }}
          >
            <Text>Phone Number</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "phone_change",
                  value
                })
              }
              value={state.phone_number ?? undefined}
              cursorColor={colors.primary}
              textContentType={"telephoneNumber"}
              keyboardType={"numeric"}
              autoCorrect={false}
              autoComplete={"tel"}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 14,
                borderRadius: 10,
                opacity: 20,
                backgroundColor: colors.border,
                color: colors.textSecondary
              }}
              placeholder={phonenum}
              editable={false}
            />
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 5
            }}
          >
            <Button
              onPress={handleCreateAccount}
              style={{
                paddingVertical: 10,
                alignItems: "center",
                width: "100%",
                borderRadius: 10
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Create Account'}
            </Button>
          </View>

          <View
            style={{
              marginTop: 20,
              gap: 36,
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
      </ScrollView>
    </SafeAreaView>
  );
}