import { SafeAreaView, View, Text, Button } from '@/components'
import { useLocalSearchParams } from 'expo-router';
import { HeaderNav } from '@/components/Header'
import { Image } from "expo-image";
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/utils/auth-store'

export default function GatePass() {
  const { visitId } = useLocalSearchParams<{ visitId: string }>();
  const { visitor } = useAuthStore();
  const colors = useColors();
  return (
    <SafeAreaView>
      <HeaderNav label={"Gatepass"} />
      <View>
        <View style={{
          alignItems: 'center',
          marginTop: 20
        }}>
          <Image
            source={{
              uri: 'http://localhost:3000/api/v1/qr/generate?text=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0'
            }}
            cachePolicy={"none"}
            style={{
              height: 330,
              width: 330,
              backgroundColor: 'white',
              borderRadius: 12
            }} />
        </View>
        <View style={{
          marginTop: 30,
          gap: 12
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 30
          }}>
            <Text type={"secondary"} style={{
              fontSize: 16
            }}>Full Name</Text>
            <Text type={"semibold"} style={{
              fontSize: 18
            }}>{visitor.firstname + " " + visitor.lastname}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 30
          }}>
            <Text type={"secondary"} style={{
              fontSize: 16
            }}>Visiting</Text>
            <Text type={"semibold"} style={{
              fontSize: 18
            }}>Admission</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}