import { Text, View, Modal, ModalContent, Input, Button, showToast } from '@/components';
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Visitor } from '@/types/visitor'
import { useReducer } from 'react'

type EditProfileProps = {
  onClose?: () => void;
  visible: boolean;
  visitor: Visitor;
}

type ActionType = {
  type: 'email_change' | 'mi_change' | 'firstname_change' | 'lastname_change';
  value: string | null;
}
type StateType = {
  firstname: string;
  lastname: string;
  middle_initial: string;
  email: string;
}

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case "email_change": {
      return {
        ...state,
        email: action.value
      };
    }
    case "firstname_change": {
      return {
        ...state,
        firstname: action.value
      };
    }
    case "lastname_change": {
      return {
        ...state,
        lastname: action.value
      };
    }
    case "mi_change": {
      return {
        ...state,
        middle_initial: action.value
      };
    }
  }
  throw Error("Unknown action: " + action.type);
}

export function EditProfile({ onClose, visible, visitor }: EditProfileProps) {

  const [state, dispatch] = useReducer(reducer, {
    email: visitor.email,
    firstname: visitor.firstname,
    lastname: visitor.lastname,
    middle_initial: visitor.middle_initial
  });
  
  const handleUpdateAccount = async () => {
    try {
      showToast({
        type: 'success',
        text1: 'Update User',
        text2: 'Successfully updated your personal information'
      })
    } catch (error) {
      console.error(error);
    }
  }

  const colors = useColors();
  return (
    <Modal visible={visible} onRequestClose={onClose} animationType={'slide'}>
      <ModalContent style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        minWidth: 320
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text type="semibold" style={{
            fontSize: 18,
            color: colors.primary
          }}>Edit Profile</Text>
          <Button variant="icon" onPress={onClose}>
            <Ionicons name="close-outline" size={22} color={colors.text} />
          </Button>
        </View>

        <View style={{
          marginTop: 12,
          gap: 5
        }}>

          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>First Name</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "firstname_change",
                  value
                })
              }
              value={state.firstname ?? undefined}
              placeholder="Enter your first name"
            />
          </View>
          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>Last Name</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "lastname_change",
                  value
                })
              }
              value={state.lastname ?? undefined}
              placeholder="Enter your last name"
            />
          </View>
          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>Middle Initial</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "mi_change",
                  value
                })
              }
              value={state.middle_initial ?? undefined}
              placeholder="Enter your middle initial"
            />
          </View>
          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>Email</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "email_change",
                  value
                })
              }
              value={state.email ?? undefined}
              placeholder="Enter your email"
            />
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            marginTop: 12,
            marginBottom: 5
          }}>
            <Button
              variant={"outline"}
              onPress={onClose}
              style={{
                paddingHorizontal: 42
              }}
            >Cancel</Button>
            <Button
              onPress={handleUpdateAccount}
              style={{
                paddingHorizontal: 42
              }}>Confirm</Button>
          </View>

        </View>
      </ModalContent>
    </Modal>
  )
}