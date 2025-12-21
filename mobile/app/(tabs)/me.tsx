import React, { useState } from "react";
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
  const { logout, accessToken, visitor } = useAuthStore();
  const [editProfile, showEditProfile] = useState(false);
  
  if(!visitor) return <Text>Something went wrong! Imissyou Renelyn -_^</Text>;

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
              <Octicons name={visitor.verified && visitor.activated ? 'verified' : 'unverified'} size={12} color={visitor.verified && visitor.activated ? colors.primary : colors.textSecondary} />
              <Text style={{
                fontSize: 12,
                color: visitor.verified && visitor.activated ? colors.primary : colors.textSecondary
              }}>{visitor.verified && visitor.activated ? 'Account Verified' : 'Please submit your Valid ID'}</Text>
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
                {visitor.firstname}
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
