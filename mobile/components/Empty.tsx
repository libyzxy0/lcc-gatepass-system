import { Text, View, SafeAreaView } from '@/components'
import { Image } from 'expo-image'
import { useColors } from '@/hooks/useColors'
import empty from "@/assets/images/storyset/empty.svg";

export function Empty() {
  const colors = useColors()
  return (
    <SafeAreaView style={{
      alignItems: 'center'
    }}>
      <View style={{
        alignItems: 'center',
        paddingTop: 150
      }}>
        <Image
          source={empty}
          style={{ width: 200, height: 150 }}
          contentFit="cover"
        />
        <View style={{
          marginTop: 30
        }}>
          <Text 
          type="semibold"
          style={{
            textAlign: 'center',
            marginBottom: 10
          }}>No Gatepass Yet</Text>
          <Text style={{
            textAlign: 'center'
          }}>Tap the plus (+) icon to request a gatepass from Administrators.</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}