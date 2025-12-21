import { Text, View, Modal, ModalContent, Button } from '../../'
import { useColors } from '@/hooks/useColors'
import { ActivityIndicator } from 'react-native'

type ModalConfirmProps = {
  visible: boolean;
}

export function ModalLoading({ visible }: ModalConfirmProps) {
  const colors = useColors();
  
  return (
    <Modal visible={visible}>
      <ModalContent style={{
        borderRadius: 6,
      }}>
        <View style={{
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{
            fontSize: 16,
            color: colors.textSecondary
          }}>Loading please wait...</Text>
        </View>
      </ModalContent>
    </Modal>
  )
}