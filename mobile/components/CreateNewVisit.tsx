import React, { useState, useReducer } from 'react'
import { Text, View, Modal, ModalContent, Input, Button, showToast } from '@/components';
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Switch } from 'react-native'
import RNDateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Octicons from '@expo/vector-icons/Octicons';
import { createVisit } from '@/api/helper/visits'

type CreateNewVisit = {
  visible: boolean;
  onClose?: () => void;
  onCreate?: () => void;
}

type ReducerState = {
  purpose: string;
  description: string;
  visiting: string;
  date: string;
  secured: boolean;
}

type ReducerAction = {
  type: 'RESET' | 'purpose_change' | 'description_change' | 'visiting_change' | 'date_change' | 'secured_change',
  value: string;
}

export function CreateNewVisit({
  visible,
  onClose,
  onCreate
}: CreateNewVisit) {
  const colors = useColors()
  const [loading, setLoading] = useState(false);
  const [datepicker, showDatePicker] = useState(false);

  const initialState = {
    purpose: null,
    description: null,
    visiting: null,
    date: null,
    secured: true
  };

  const [state, dispatch] = useReducer(function (state: ReducerState, action: ReducerAction) {
    switch (action.type) {
      case "RESET": {
        return initialState;
      }
      case "purpose_change": {
        return {
          ...state,
          purpose: action.value
        };
      }
      case "description_change": {
        return {
          ...state,
          description: action.value
        };
      }
      case "visiting_change": {
        return {
          ...state,
          visiting: action.value
        };
      }
      case "date_change": {
        return {
          ...state,
          date: action.value
        };
      }
      case "secured_change": {
        return {
          ...state,
          secured: action.value
        };
      }
    }
  }, initialState);

  const handleClose = () => {
    dispatch({
      type: 'RESET'
    })
    onClose?.();
    showDatePicker(false);
  }

  const handleCreate = async () => {
    if (!state.purpose || !state.visiting || !state.date) {
      showToast({
        type: 'warning',
        text1: 'Complete the Fields',
        text2: 'Please fill up all of the required fields'
      });
      return;
    }

    setLoading(true);
    const data = await createVisit(state);

    if (data.error) {
      showToast({
        type: 'error',
        text1: 'Failed to create visit',
        text2: data.error
      });
      setLoading(false);
      return;
    }

    showToast({
      type: 'success',
      text1: 'Visit Request Created',
      text2: data.message
    })

    onCreate?.();
    handleClose();
    setLoading(false);
  }

  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;

    if (type === 'dismissed') {
      showDatePicker(false);
      return;
    }
    if (type === 'set') {
      showDatePicker(false);
      const dateISO = new Date(timestamp).toISOString();
      dispatch({
        type: "date_change",
        value: dateISO
      })
    }
  };

  return (
    <Modal visible={visible} onRequestClose={handleClose}>
      {datepicker && (
        <RNDateTimePicker
          mode="date"
          value={state.date ? new Date(state.date) : new Date()}
          minimumDate={new Date()}
          display={'calendar'}
          themeVariant="light"
          positiveButton={{ label: "OK NA 'TO", textColor: colors.success }}
          negativeButton={{ label: 'Cancel', textColor: colors.primary }}
          onChange={setDate}
        />
      )}
      <ModalContent
        style={{
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
          }}>Request Visit</Text>
          <Button variant="icon" onPress={handleClose}>
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
            }}>Purpose <Text style={{ color: colors.danger }}>*</Text></Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "purpose_change",
                  value
                })
              }
              value={state.purpose ?? undefined}
              placeholder="Enter Visit Purpose"
            />
          </View>

          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>Description</Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "description_change",
                  value
                })
              }
              value={state.description ?? undefined}
              multiline
              numberOfLines={4}
              placeholder="Enter Visit Description"
            />
          </View>

          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>Office/Who To Visit <Text style={{ color: colors.danger }}>*</Text></Text>
            <Input
              onChangeText={value =>
                dispatch({
                  type: "visiting_change",
                  value
                })
              }
              value={state.visiting ?? undefined}
              placeholder="Enter the Office/Who to visit"
            />
          </View>
          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>Date of Visit <Text style={{ color: colors.danger }}>*</Text></Text>

            <Button
              variant={'outline'}
              style={{
                width: '100%',
                backgroundColor: colors.input
              }}
              onPress={() => showDatePicker(true)}>
              <Text type="secondary">
                {state.date ? new Date(state.date).toLocaleDateString() : 'Select your Date of Visit'}
              </Text>
            </Button>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            marginLeft: 2
          }}>

            <BouncyCheckbox
              iconComponent={<Octicons name={'shield-check'} size={12} color={'#ffffff'} />}
              size={20}
              fillColor={colors.success}
              unFillColor="#FFFFFF"
              text="Enable Secured Pass"
              innerIconStyle={{ borderWidth: 1 }}
              disableText={true}
              textStyle={{ fontFamily: "Poppins", fontSize: 14 }}
              onPress={(isChecked: boolean) => dispatch({
                type: 'secured_change',
                value: isChecked
              })}
              isChecked={state.secured}
            />
            
            <Text>Enable Secured Pass</Text>
          </View>

          <View style={{
            marginTop: 12,
            marginBottom: 5,
            width: '100%'
          }}>
            <Button
              onPress={handleCreate}
              style={{
                width: '100%',
                minHeight: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {loading ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : 'Create Visit'}
            </Button>
          </View>
        </View>
      </ModalContent>
    </Modal>
  )
}