import {
  Text,
  View,
  Button,
  Input,
  SafeAreaView,
  showToast,
  Link,
  Dropdown
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
import { normalize } from '@/utils/format-ph-number'
import { ActivityIndicator } from 'react-native'
import { HeaderNav } from '@/components/Header'

type ActionType = {
  type: 'email_change' | 'address_change' | 'pin_change' | 'phone_change' | 'firstname_change' | 'lastname_change';
  value: string | null;
}

type CredType = {
  email: string | null;
  address: string | null;
  password: string | null;
  confirm_password: string | null;
  firstname: string | null;
  lastname: string | null;
}

const genderOptions = [
  {
    label: 'Male',
    value: 'male'
  },
  {
    label: 'Female',
    value: 'female'
  },
  {
    label: 'Other',
    value: 'other'
  },
]
function reducer(state: CredType, action: ActionType) {
  switch (action.type) {
    case "email_change": {
      return {
        ...state,
        email: action.value
      };
    }
    case "address_change": {
      return {
        ...state,
        address: action.value
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
  const [currentPageIndex, setCurrentPageIndex] = useState(1);

  const [state, dispatch] = useReducer(reducer, {
    phone_number: normalize(phonenum),
    email: null,
    address: null,
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
      setLoading(false);
      return;
    }
    if (!state.lastname) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your lastname.`
      });
      setLoading(false);
      return;
    }
    if (!state.email) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your email.`
      });
      setLoading(false);
      return;
    }
    if (!state.address) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your address.`
      });
      setLoading(false);
      return;
    }

    if (!state.phone_number) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your phone number.`
      });
      setLoading(false);
      return;
    }

    if (!state.pin) {
      showToast({
        type: "warning",
        text1: "Failed to create account!",
        text2: `Please enter your desired pin!`
      });
      setLoading(false);
      return;
    }

    const data = await visitorRegister(state);

    if (data && data.success) {
      showToast({
        type: "success",
        text1: "Account Created",
        text2: data.message
      });
      setPhoneNumber(normalize(phonenum));
      await login(state.pin);
      setLoading(false);
      router.push('/otp');
    } else {
      showToast({
        type: "error",
        text1: "Ohh No! There's an Error!",
        text2: data.message
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderNav
          label={"Create new Account"}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 52,
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
            <Text>Desired Four Digit Pin</Text>
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
            <Text>Address</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "address_change",
                  value
                })
              }
              value={state.address ?? undefined}
              cursorColor={colors.primary}
              textContentType={"streetAddressLine1"}
              autoCorrect={false}
              autoComplete={"address-line1"}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 14,
                borderRadius: 10,
              }}
              placeholder={"Kaypian, San Jose del Monte, Bulacan"}
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
              {loading ? (
                <ActivityIndicator size={22} color={'white'} />
              ) : 'Create Account'}
            </Button>
          </View>
          
          <View
            style={{
              gap: 36,
              alignItems: "center"
            }}
          >
            <Text
              type="secondary"
              style={{
                fontSize: 12,
                textAlign: 'left'
              }}
            >
              By continuing, you're agreeing to give us your consent to <Text style={{
                fontSize: 12,
                color: colors.primary
              }}>receive automated SMS and Email notifications</Text> about your account and gatepass statuses or any updates from La Concepcion College Digital Gatepass System.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}