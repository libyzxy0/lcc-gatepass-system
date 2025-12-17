import { Text, View, SafeAreaView } from '@/components'
import { Image } from 'expo-image'
import { useColors } from '@/hooks/useColors'
import logo from "@/assets/images/icon.png";
import { ActivityIndicator } from 'react-native'
export default function SplashLoading() {
  const colors = useColors()
  return (
    <SafeAreaView style={{
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <View style={{
        justifyContent: 'center'
      }}>
        <Image
          source={logo}
          style={{ width: 300, height: 120 }}
          contentFit="cover"
        />
        <View style={{
          marginTop: 20
        }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    </SafeAreaView>
  )
}