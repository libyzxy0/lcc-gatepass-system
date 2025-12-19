import React, { useState } from 'react'
import { Text, View, Modal, ModalContent, Input, Button, showToast } from '@/components';
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Visitor } from '@/types/visitor'
import { useReducer } from 'react'
import { updateVisitor } from '@/api/helper/update-account'
import { useAuthStore } from "@/utils/auth-store";
import { ActivityIndicator } from 'react-native'

type EditProfileProps = {
  onClose?: () => void;
  visible: boolean;
  visitor: Visitor;
}

type ActionType = {
  type: 'email_change' | 'mi_change' | 'firstname_change' | 'lastname_change' | 'address_change';
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
    case "address_change": {
      return {
        ...state,
        address: action.value
      };
    }
  }
  throw Error("Unknown action: " + action.type);
}

export function EditProfile({ onClose, visible, visitor }: EditProfileProps) {
  const [loading, setLoading] = useState(false);
  const { getSession } = useAuthStore();
  const [state, dispatch] = useReducer(reducer, {
    email: visitor.email,
    firstname: visitor.firstname,
    lastname: visitor.lastname,
    middle_initial: visitor.middle_initial,
    address: visitor.address
  });

  const handleUpdateAccount = async () => {
    try {
      setLoading(true);
      const data = await updateVisitor({ id: visitor.id, fields: state });
      await getSession();
      if (data.error) {
        showToast({
          type: 'error',
          text1: 'Failed to update your account',
          text2: data.error
        })
        return;
      }
      showToast({
        type: 'success',
        text1: 'Account Updated',
        text2: data.message
      })
      onClose?.();
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Unknown Error',
        text2: 'Something went wrong, please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  const colors = useColors();
  return (
    <Modal visible={visible} onRequestClose={onClose}>
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
          <Text type="bold" style={{
            fontSize: 20
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
            }}>Address</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "address_change",
                  value
                })
              }
              multiline
              numberOfLines={4}
              value={state.address ?? undefined}
              placeholder="Enter your current address"
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
            marginTop: 12,
            marginBottom: 5,
            width: '100%'
          }}>
            <Button
              onPress={handleUpdateAccount}
              style={{
                width: '100%',
                minHeight: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {loading ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : 'Update Account'}
            </Button>
          </View>

        </View>
      </ModalContent>
    </Modal>
  )
}