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
      <HeaderNav
        label={"Gatepass"}
        ActionComponent={
          <Button
            variant={'secondary'}
            style={{
              paddingVertical: 2,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gapHorizontal: 5,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: colors.border
            }}
          >
            <Ionicons name="save-outline" size={14} color={colors.text} />
            <Text>{" "}Save</Text>
          </Button>
        }
      />
      <View>
        <View style={{
          alignItems: 'center',
          marginTop: 20
        }}>
          <Image
            source={{
              uri: `http://localhost:3000/api/v1/qr/generate?text=${visitor.id}-${visitor.firstname}-${visitor.lastname}-${visitId}`
            }}
            placeholder={{ blurhash: 'B5Q]?40504~UM}E3' }}
            transition={500}
            cachePolicy={"none"}
            style={{
              height: 330,
              width: 330,
              backgroundColor: 'white',
              borderRadius: 12
            }} />
        </View>
        <View style={{
          marginTop: 20,
          gap: 12,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          marginHorizontal: 20,
          padding: 12
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text type={"secondary"} style={{
              fontSize: 16
            }}>Name</Text>
            <Text type={"semibold"} style={{
              fontSize: 16
            }}>{visitor.firstname + " " + visitor.lastname}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text type={"secondary"} style={{
              fontSize: 16
            }}>Visiting</Text>
            <Text type={"semibold"} style={{
              fontSize: 16
            }}>Jay Pineda</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text type={"secondary"} style={{
              fontSize: 16
            }}>Scheduled Date</Text>
            <Text type={"semibold"} style={{
              fontSize: 16
            }}>Dec 21 2025</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text type={"secondary"} style={{
              fontSize: 16
            }}>Purpose</Text>
            <Text type={"semibold"} style={{
              fontSize: 16
            }}>Get My Child's Report Card</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text type={'italic'} style={{
              fontSize: 14,
              textAlign: 'center',
              color: colors.textSecondary
            }}>“I want to get my child's report card to see his grades and progress in school.”</Text>
          </View>
        </View>

        <Text type={'italic'} style={{
          fontSize: 12,
          textAlign: 'center',
          color: colors.textSecondary,
          marginTop: 40,
          marginHorizontal: 20
        }}>© Copyright 2025, La Concepcion College Digital Gatepass System, All rights reserved.</Text>
      </View>
    </SafeAreaView>
  )
}