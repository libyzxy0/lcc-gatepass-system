import React, { forwardRef, useState, useEffect } from "react";
import { Text, View, Button, Dropdown, showToast } from "@/components";
import { useColors } from "@/hooks/useColors";
import { BottomSheet } from "@/components/ui/BottomSheet";
import DefaultBottomSheet, {
  BottomSheetTextInput
} from "@gorhom/bottom-sheet";
import RNDateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type DropdownOption } from '@/components/ui/Dropdown'
import { requestGatepass } from '@/api/helper/gatepass';
import { useGatepassStore } from '@/utils/gatepass-store'

export const RequestGatepassSheet = forwardRef<BottomSheet, any>((props, ref) => {
  const colors = useColors();
  const [datepicker, showDatePicker] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<DropdownOption>({ label: '', value: '' });
  const [selectedVehicleOption, setSelectedVehicleOption] = useState<DropdownOption>({ label: "No, I don't have", value: 'no' });
  const [selectedVehicleType, setSelectedVehicleType] = useState<DropdownOption>({ label: '', value: '' });
  const [description, setDescription] = useState<string | null>(null);
  const [subPurpose, setSubPurpose] = useState<string | null>(null);
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [vehiclePlateNo, setVehiclePlateNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { fetchGatepass } = useGatepassStore();

  const purposeOptions = [
    {
      label: 'Attend School Event',
      value: 'school_event'
    },
    {
      label: 'Admission Inquiry',
      value: 'admission_inquiry'
    },
    {
      label: 'Document Processing',
      value: 'documents'
    },
    {
      label: 'Meet Teacher/Faculty',
      value: 'meet_teacher'
    },
    {
      label: 'Meet Student',
      value: 'meet_student'
    },
    {
      label: 'Meet Principal/Admin',
      value: 'meet_principal'
    },
    {
      label: 'Payment/Finance',
      value: 'payment'
    },
    {
      label: 'Delivery/Supplier',
      value: 'delivery'
    },
    {
      label: 'Job Interview',
      value: 'interview'
    },
    {
      label: 'Maintenance/Repair',
      value: 'maintenance'
    },
    {
      label: 'Other',
      value: 'other'
    }
  ]

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
      const iso = new Date(timestamp).toISOString();
      setDateISO(iso);
    }
  };

  const handleRequestGatepass = async () => {
    if (selectedPurpose.value === '') {
      showToast({
        type: 'warning',
        text1: 'Incomplete Field',
        text2: "Please fill up 'Purpose' field"
      })
      return;
    }
    if (['meet_student', 'meet_principal', 'meet_teacher', 'other'].includes(selectedPurpose.value) && subPurpose === null) {
      showToast({
        type: 'warning',
        text1: 'Incomplete Field',
        text2: "Please fill up 'Purpose' field"
      })
      return;
    }
    if (description === null) {
      showToast({
        type: 'warning',
        text1: 'Incomplete Field',
        text2: "Please fill up 'Description' field"
      })
      return;
    }
    if (dateISO === null) {
      showToast({
        type: 'warning',
        text1: 'Incomplete Field',
        text2: "Please select the date of your visit"
      })
      return;
    }

    if (selectedVehicleOption.value === 'yes' && selectedVehicleType.value === '') {
      showToast({
        type: 'warning',
        text1: 'Incomplete Field',
        text2: "Please enter the type of your vehicle"
      })
      return;
    }
    if (selectedVehicleOption.value === 'yes' && !vehiclePlateNo) {
      showToast({
        type: 'warning',
        text1: 'Incomplete Field',
        text2: "Please enter the plate number of your vehicle"
      })
      return;
    }

    let purpose = selectedPurpose.label;

    if (['meet_student', 'meet_principal', 'meet_teacher'].includes(selectedPurpose.value)) {
      purpose = `Meet ${subPurpose}`;
    } else if (selectedPurpose.value === 'other') {
      purpose = subPurpose;
    }

    const data = {
      purpose,
      description,
      schedule_date: dateISO,
      vehicle: selectedVehicleOption.value === 'yes' ? {
        type: selectedVehicleType.label,
        plate_number: vehiclePlateNo
      } : null
    }

    setLoading(true);
    const gpass = await requestGatepass(data);

    if (gpass.error) {
      console.error(gpass.error);
      showToast({
        type: 'error',
        text1: 'Failed to request gatepass',
        text2: gpass.error
      });
      return;
    }
    
    await fetchGatepass();

    setSelectedPurpose({ label: '', value: '' })
    setSelectedVehicleType({ label: '', value: '' })
    setSelectedVehicleOption({ label: "No, I don't have", value: 'no' })
    setSubPurpose(null);
    setDescription(null);
    setDateISO(null);
    setVehiclePlateNo(null);
    setLoading(false);
    ref.current?.close();
    showToast({
      type: 'success',
      text1: 'Request Sent!',
      text2: gpass.message
    });
  }

  return (
    <BottomSheet
      keyboardBehavior={'extend'}
      containerStyle={{
        paddingHorizontal: 20
      }}
      ref={ref} snapPoints={["65%", "95%"]}
      enablePanDownToClose
      enableContentPanningGesture={false}
    >
      {datepicker && (
        <RNDateTimePicker
          mode="date"
          value={dateISO ? new Date(dateISO) : new Date()}
          minimumDate={new Date()}
          display={'calendar'}
          themeVariant="light"
          positiveButton={{ label: "OK NA 'TO", textColor: colors.success }}
          negativeButton={{ label: 'Cancel', textColor: colors.primary }}
          onChange={setDate}
        />
      )}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text
          type="bold"
          style={{
            fontSize: 20
          }}
        >
          Request Gatepass
        </Text>
        <Button variant="icon" onPress={() => ref.current?.close()}>
          <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
        </Button>
      </View>
      <View
        transparent
        style={{
          marginTop: 20,
          gap: 8
        }}
      >
        <View
          transparent
          style={{
            gap: 5,
          }}
        >
          <Text type={'secondary'}>Purpose <Text style={{ color: colors.danger }}>*</Text></Text>
          <Dropdown
            placeholder={'Select Purpose of your visit'}
            onSelect={(slc) => {
              setSelectedPurpose(slc);
              setSubPurpose(null);
            }}
            selectedValue={selectedPurpose}
            options={purposeOptions}
            dropdownStyle={{
              top: 30
            }}
          />
          {selectedPurpose.value === 'other' && (
            <BottomSheetTextInput
              onChangeText={setSubPurpose}
              defaultValue={subPurpose}
              style={{
                backgroundColor: colors.input,
                color: colors.text,
                paddingHorizontal: 15,
                borderRadius: 7,
                borderWidth: 1,
                borderColor: colors.border
              }}
              placeholder="Please specify purpose of your visit"
              placeholderTextColor={colors.textSecondary}
            />
          )}
          {['meet_student', 'meet_principal', 'meet_teacher'].includes(selectedPurpose.value) && (
            <BottomSheetTextInput
              onChangeText={setSubPurpose}
              defaultValue={subPurpose}
              style={{
                backgroundColor: colors.input,
                color: colors.text,
                paddingHorizontal: 15,
                borderRadius: 7,
                borderWidth: 1,
                borderColor: colors.border
              }}
              placeholder="Enter his/her name"
              placeholderTextColor={colors.textSecondary}
            />
          )}
        </View>

        <View
          transparent
          style={{
            gap: 5
          }}
        >
          <Text type={'secondary'}>
            Description <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <BottomSheetTextInput
            onChangeText={setDescription}
            defaultValue={description}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: colors.input,
              color: colors.text,
              paddingHorizontal: 15,
              borderRadius: 7,
              borderWidth: 1,
              borderColor: colors.border
            }}
            placeholder="Enter the description of your visit"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View
          transparent
          style={{
            gap: 5
          }}
        >
          <Text type={'secondary'}>
            Date of Visit <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <Button
            variant={'outline'}
            style={{
              width: '100%',
              backgroundColor: colors.input
            }}
            onPress={() => showDatePicker(true)}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{
                color: !dateISO ? colors.textSecondary : colors.text
              }}>
                {dateISO ? new Date(dateISO).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Select your Date of Visit'}
              </Text>
              <Ionicons
                name={datepicker ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.textSecondary}
              />
            </View>
          </Button>
        </View>

        <View
          transparent
          style={{
            gap: 5,
          }}
        >
          <Text type={'secondary'}>Have a Vehicle?</Text>
          <Dropdown
            placeholder={"No, I don't have"}
            onSelect={setSelectedVehicleOption}
            selectedValue={selectedVehicleOption}
            options={[
              {
                label: 'Yes, I have',
                value: 'yes'
              },
              {
                label: "No, I don't have",
                value: 'no'
              }
            ]}
            dropdownStyle={{
              bottom: 30
            }}
          />
        </View>

        {selectedVehicleOption.value === 'yes' && (
          <>
            <View
              transparent
              style={{
                gap: 5
              }}
            >
              <Text type={'secondary'}>
                Type of Vehicle <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <Dropdown
                placeholder={"Select vehicle type"}
                onSelect={setSelectedVehicleType}
                selectedValue={selectedVehicleType}
                options={[
                  {
                    label: 'Motorcycle',
                    value: 'motorcycle'
                  },
                  {
                    label: "Tricycle",
                    value: 'tricycle'
                  },
                  {
                    label: "Car (4 Wheels)",
                    value: 'car'
                  },
                ]}
                dropdownStyle={{
                  bottom: 30
                }}
              />
            </View>
            <View
              transparent
              style={{
                gap: 5
              }}
            >
              <Text type={'secondary'}>
                Plate Number <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <BottomSheetTextInput
                onChangeText={setVehiclePlateNo}
                defaultValue={vehiclePlateNo}
                style={{
                  backgroundColor: colors.input,
                  color: colors.text,
                  paddingHorizontal: 15,
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: colors.border
                }}
                placeholder="Enter the plate number of your vehicle"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </>
        )}

        <View style={{
          flex: 1,
          marginTop: 6
        }}>
          <Button
            onPress={() => handleRequestGatepass()}
            style={{
              width: '100%',
              paddingVertical: 9,
              alignItems: 'center'
            }}
          >
            {loading ? 'Loading...' : 'Request Gatepass'}
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
});