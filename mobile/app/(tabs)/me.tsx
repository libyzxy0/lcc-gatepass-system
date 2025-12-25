import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, Button } from "@/components";
import { ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/utils/auth-store";
import { Header } from "@/components/Header";
import { Image } from "expo-image";
import { EditProfile } from "@/components/EditProfile";
import { formatPHNumber } from "@/utils/format-ph-number";
import { ProfileImage } from "@/components/ProfileImage";
import { ProfileValidId } from "@/components/ProfileValidId";
import Octicons from '@expo/vector-icons/Octicons';

export default function Settings() {
  const colors = useColors();
  const { logout, accessToken, visitor, getSession } = useAuthStore();
  const [editProfile, showEditProfile] = useState(false);
  
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await getSession();
      } catch (e) {
        console.error(e);
      }
    };

    restoreSession();
  }, []);
  
  const accountStatus = (vst) => {
    if(vst.activated === false) return {
       label: "Account not activated",
       color: colors.textSecondary
     };
    if(!vst.valid_id_photo_url) return { 
      label:"Missing Valid ID",
      color: colors.textSecondary
    };
    if(vst.valid_id_photo_url && vst.verified === false) return {
      label: "Account In Review",
      color: colors.warning
    };
    if(vst.verified === false) return {
      label: "Not Verified",
      color: colors.danger
    }
    if(vst.verified) return {
      label: "Verified Account",
      color: colors.primary
    }
  }
  
  if(!visitor) return <Text>ERROR[CODE_SUPOT101] Failed to get session!</Text>;

  return (
    <SafeAreaView>
      <Header />
      <EditProfile
        visible={editProfile}
        onClose={() => showEditProfile(false)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            paddingVertical: 20,
            flexDirection: "row",
            gap: 16,
            alignItems: "center"
          }}
        >
          <ProfileImage url={visitor?.photo_url} id={visitor.id} />
          <View>
            <Text type="semibold">
              {visitor.firstname} {visitor.middle_initial}
              {visitor.middle_initial !== null && " "}
              {visitor.lastname}
              {" "}
            </Text>
            <Text type="secondary">
              {"(+63) " + formatPHNumber(visitor.phone_number)}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5
            }}>
              <Octicons name={visitor.verified ? 'verified' : 'unverified'} size={12} color={accountStatus(visitor).color} />
              <Text style={{
                fontSize: 12,
                color: accountStatus(visitor).color
              }}>{accountStatus(visitor).label}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 12
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text
              type="semibold"
              style={{
                fontSize: 18
              }}
            >
              Visitor Info
            </Text>
            <Text type="link" onPress={() => showEditProfile(true)}>
              Edit Info
            </Text>
          </View>

          <View>
            <View>
              <Text
                type="secondary"
                style={{
                  fontSize: 12
                }}
              >
                First Name
              </Text>
              <Text
                type="semibold"
                style={{
                  fontSize: 16
                }}
              >
                {visitor.firstname}
              </Text>
            </View>
            <View>
              <Text
                type="secondary"
                style={{
                  fontSize: 12
                }}
              >
                Last Name
              </Text>
              <Text
                type="semibold"
                style={{
                  fontSize: 16
                }}
              >
                {visitor.lastname}
              </Text>
            </View>
            <View>
              <Text
                type="secondary"
                style={{
                  fontSize: 12
                }}
              >
                Middle Initial
              </Text>
              <Text
                type="semibold"
                style={{
                  fontSize: 16
                }}
              >
                {visitor.middle_initial ?? "N/A"}
              </Text>
            </View>
            <View>
              <Text
                type="secondary"
                style={{
                  fontSize: 12
                }}
              >
                Address
              </Text>
              <Text
                type="semibold"
                style={{
                  fontSize: 16
                }}
              >
                {visitor.address ?? 'N/A'}
              </Text>
            </View>
            <View>
              <Text
                type="secondary"
                style={{
                  fontSize: 12
                }}
              >
                Email
              </Text>
              <Text
                type="semibold"
                style={{
                  fontSize: 16
                }}
              >
                {visitor.email}
              </Text>
            </View>
            <View>
              <Text
                type="secondary"
                style={{
                  fontSize: 12
                }}
              >
                Phone Number
              </Text>
              <Text
                type="semibold"
                style={{
                  fontSize: 16
                }}
              >
                {"(+63) " + formatPHNumber(visitor.phone_number)}
                {" "}
                <Octicons name="verified" size={16} color={colors.success} />
              </Text>
            </View>
          </View>
          <ProfileValidId />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
