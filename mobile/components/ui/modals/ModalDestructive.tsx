import { Text, View, Modal, ModalContent, Button } from '../../'
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native'

type ModalConfirmProps = {
  onConfirm?: () => void;
  onClose?: () => void;
  visible: boolean;
  title?: string | null;
  description: string;
  closeAfterConfirm?: boolean;
  buttonLabel?: string;
  loading: boolean;
}

export function ModalDestructive({ onConfirm, onClose, visible, title, description, closeAfterConfirm, buttonLabel, loading }: ModalConfirmProps) {
  const colors = useColors();

  const handleConfirmation = () => {
    if (closeAfterConfirm) {
      onConfirm?.();
      onClose?.();
    } else {
      onConfirm?.();
    }
  }

  return (
    <Modal onRequestClose={onClose} visible={visible}>
      <ModalContent style={{
        width: 200,
      }}>
        <View>
          <View style={{
            alignItems: 'center',
          }}>
            <Text type={"bold"} style={{
              color: colors.danger,
              fontSize: 22
            }}>{title ? title : 'Are you sure?'}</Text>
            <Text type={"secondary"} style={{
              textAlign: 'center'
            }}>{description}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginTop: 12
          }}>
            <Button
              variant={"outline"}
              onPress={onClose}
              style={{
                paddingHorizontal: 38,
                minWidth: 125,
                minHeight: 38
              }}
            >Cancel</Button>
            <Button
              variant={'danger'}
              onPress={handleConfirmation}
              style={{
                paddingHorizontal: 38,
                width: 125,
                minHeight: 38
              }}>{loading ? (
                <ActivityIndicator size={'small'} color={'white'} />
              ) : buttonLabel ? buttonLabel : 'Delete'}</Button>
          </View>
        </View>
      </ModalContent>
    </Modal>
  )
}