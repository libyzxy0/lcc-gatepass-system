import React, { useState } from 'react'
import { Text, View, Modal, ModalContent, Input, Button, showToast } from '@/components';
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native'
import RNDateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

type CreateNewVisit = {
  visible: boolean;
  onClose?: () => void;
}

export function CreateNewVisit({
  visible,
  onClose
}: CreateNewVisit) {
  const colors = useColors()
  const [loading, setLoading] = useState(false);
  const [datepicker, showDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleClose = () => {
    onClose?.();
    showDatePicker(false);
  }

  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;
    
    if(type === 'dismissed') {
      showDatePicker(false);
      return;
    }
    if(type === 'set') {
      showDatePicker(false);
      const dateISO = new Date(timestamp).toISOString();
      setSelectedDate(dateISO);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={handleClose}>
      {datepicker && (
        <RNDateTimePicker
          mode="date"
          value={selectedDate ? new Date(selectedDate) : new Date()}
          minimumDate={new Date()}
          display={'calendar'}
          themeVariant="light"
          positiveButton={{ label: "OK NA 'TO", textColor: colors.primary }}
          negativeButton={{ label: 'Cancel', textColor: colors.danger }}
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
          }}>Create Visit</Text>
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
            }}>Purpose</Text>
            <Input
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
            }}>Office/Who To Visit</Text>
            <Input
              placeholder="Enter the Office/Who to visit"
            />
          </View>
          <View style={{
            gap: 2
          }}>
            <Text style={{
              fontSize: 12
            }}>Date of Visit</Text>

            <Button
              variant={'outline'}
              style={{
                width: '100%',
                backgroundColor: colors.input
              }}
              onPress={() => showDatePicker(true)}>
              <Text type="secondary">
              {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Select your Date of Visit'}
              </Text>
            </Button>
          </View>

          <View style={{
            marginTop: 12,
            marginBottom: 5,
            width: '100%'
          }}>
            <Button
              style={{
                width: '100%',
                minHeight: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {loading ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : 'Create'}
            </Button>
          </View>

        </View>

      </ModalContent>
    </Modal>
  )
}