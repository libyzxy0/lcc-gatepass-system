import Octicons from '@expo/vector-icons/Octicons';
import { TouchableOpacity } from 'react-native'
import { useColors } from "@/hooks/useColors";

export function CreateVisitFloatingButton({ onPress }: { onPress: () => void; }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        position: 'absolute',
        bottom: 20,
        right: 5,
        zIndex: 90,
        height: 54,
        width: 54,
        borderRadius: 50,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.shadow + '0A'
      }}>
      <Octicons name="plus" size={26} color={'white'} />
    </TouchableOpacity>
  )
}