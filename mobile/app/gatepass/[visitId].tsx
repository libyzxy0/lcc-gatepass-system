import { SafeAreaView, View, Text, Button, showToast } from '@/components'
import { useLocalSearchParams } from 'expo-router';
import { HeaderNav } from '@/components/Header'
import { Image } from "expo-image";
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/utils/auth-store'
import ViewShot from "react-native-view-shot";
import { useRef, useEffect, useState } from 'react'
import { useSaveImage } from '@/hooks/useSaveImage'
import { useGatepassStore } from '@/utils/gatepass-store'
import { ScrollView } from 'react-native'

export default function GatePass() {
  const { visitId } = useLocalSearchParams<{ visitId: string }>();
  const { visitor } = useAuthStore();
  const { gatepass } = useGatepassStore();
  const [gpass, setGpass] = useState(null);
  const colors = useColors();
  const gatepassRef = useRef();

  const colorStatusMap = {
    'pending': colors.warning,
    'approved': colors.success,
    'expired': colors.badges.pink,
    'rejected': colors.danger
  }

  const labelMap = {
    'pending': 'Pending Approval',
    'approved': 'Gatepass Approved',
    'expired': 'Gatepass Expired',
    'rejected': 'Gatepass Rejected'
  }

  useEffect(() => {
    const getGatepassData = () => {
      const gData = gatepass.find((item) => item.id === visitId);
      setGpass(gData);
    }
    getGatepassData();
  }, [gatepass])

  const { saveGatepass, saving, error } = useSaveImage();

  const handleSave = async () => {
    const uri = await gatepassRef.current?.capture();
    if (!uri) return;
    console.log("do something with ", uri);
    const success = await saveGatepass(uri);

    if (success) {
      showToast({
        type: 'success',
        text1: 'Gatepass Saved',
        text2: 'Gatepass successfully saved in your device!'
      })
    } else {
      showToast({
        type: 'error',
        text1: 'Failed to save',
        text2: 'An error occured while saving gatepass!'
      })
    }
  }

  if (!gpass) return null;

  return (
    <SafeAreaView>
      <HeaderNav
        label={"Gatepass"}
        ActionComponent={
          <Button
            onPress={handleSave}
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
      <ScrollView 
      showsVerticalScrollIndicator={false}
      style={{
        paddingBottom: 40
      }}>
        <ViewShot ref={gatepassRef} options={{ fileName: `LCC_Gatepass-${visitor?.id}`, format: "jpg", quality: 0.9 }} style={{
          backgroundColor: colors.background
        }}>
          <View style={{
            alignItems: 'center',
            marginTop: 20
          }}>
            <Image
              source={{
                uri: `http://localhost:3000/api/v1/qr/generate?text=${gpass.qr_token}`
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
              }}>Schedule</Text>
              <Text type={"semibold"} style={{
                fontSize: 16,
                color: colors.badges.blue
              }}>{gpass.schedule_date && new Date(gpass.schedule_date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text type={"secondary"} style={{
                fontSize: 16
              }}>Status</Text>
              <Text type={"semibold"} style={{
                fontSize: 16,
                color: colorStatusMap[gpass.status]
              }}>{labelMap[gpass.status]}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text type={"secondary"} style={{
                fontSize: 16
              }}>Account</Text>
              <Text type={"semibold"} style={{
                fontSize: 16,
                color: visitor.verified ? colors.badges.green : colors.danger
              }}>{visitor.verified ? "Verified Account" : "Not Verified"}</Text>
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
              }}>{gpass.purpose}</Text>
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
              }}>“{gpass.description}”</Text>
            </View>
          </View>

          <Text type={'italic'} style={{
            fontSize: 12,
            textAlign: 'center',
            color: colors.textSecondary,
            marginTop: 40,
            marginHorizontal: 20,
            paddingBottom: 40
          }}>© Copyright 2025, La Concepcion College Digital Gatepass System, All rights reserved.</Text>
        </ViewShot>
      </ScrollView>
    </SafeAreaView>
  )
}