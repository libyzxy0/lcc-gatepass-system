import { Text, View, SafeAreaView, Button } from "@/components";
import { ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/utils/auth-store";
import { Header } from "@/components/Header";
import { Image } from 'expo-image'
import avatar from '@/assets/images/avatar.png'
export default function Settings() {
  const colors = useColors();
  const { logout, accessToken, visitor } = useAuthStore();

  return (
    <SafeAreaView>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
        paddingBottom: 20
      }}>
        <View
          style={{
            marginHorizontal: 20,
            paddingVertical: 20,
            flexDirection: 'row',
            gap: 16,
            alignItems: 'center'
          }}
        >
          <Image source={{ uri: visitor?.photo_url }} style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: colors.primary
          }} />

          <View>
            <Text type="semibold">{visitor.firstname}{" "}{visitor.middle_initial}{" "}{visitor.lastname}</Text>
            <Text type="secondary">{visitor.phone_number}</Text>
            {visitor.verified ? (
              <Text style={{
                color: colors.success
              }}>Verified Account</Text>
            ) : (
              <Text style={{
                color: colors.danger
              }}>Unverified Account</Text>
            )}
          </View>
        </View>
        <View style={{
          marginHorizontal: 20,
          marginTop: 16
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text type="semibold" style={{
              fontSize: 18
            }}>Visitor Info</Text>
            <Text type="link">Edit Info</Text>
          </View>

          <View>
            <View>
              <Text type="secondary" style={{
                fontSize: 12
              }}>{visitor.firstname}</Text>
              <Text type="semibold" style={{
                fontSize: 16
              }}>{visitor.firstname}</Text>
            </View>
            <View>
              <Text type="secondary" style={{
                fontSize: 12
              }}>Last Name</Text>
              <Text type="semibold" style={{
                fontSize: 16
              }}>{visitor.lastname}</Text>
            </View>
            <View>
              <Text type="secondary" style={{
                fontSize: 12
              }}>Middle Initial</Text>
              <Text type="semibold" style={{
                fontSize: 16
              }}>{visitor.middle_initial ?? "N/A"}</Text>
            </View>
            <View>
              <Text type="secondary" style={{
                fontSize: 12
              }}>Email</Text>
              <Text type="semibold" style={{
                fontSize: 16
              }}>{visitor.email}</Text>
            </View>
            <View>
              <Text type="secondary" style={{
                fontSize: 12
              }}>Phone Number</Text>
              <Text type="semibold" style={{
                fontSize: 16
              }}>{visitor.phone_number}</Text>
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 10
          }}>
            <Text type="semibold" style={{
              fontSize: 18
            }}>Valid ID ({visitor.valid_id_type})</Text>
            <Text type="link">Upload New</Text>
          </View>
          <Image
            style={{
              width: 280,
              height: 180,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: colors.border
            }}
            contentFit="contain"
            source={{
              uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${visitor.firstname + " " + visitor.lastname}`
            }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
