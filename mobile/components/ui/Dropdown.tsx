import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, LayoutChangeEvent } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColors } from '@/hooks/useColors';

export type DropdownOption = {
  label: string;
  value: string | number;
};

type DropdownProps = {
  options: DropdownOption[];
  placeholder?: string;
  onSelect: (option: DropdownOption) => void;
  selectedValue?: string | number;
  style?: object;
  dropdownStyle?: object;
  itemStyle?: object;
};

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = 'Select an option',
  onSelect,
  selectedValue,
  style = {},
  dropdownStyle = {},
  itemStyle = {},
}) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  const selectorRef = useRef<View>(null);

  const selectedLabel =
    options.find(opt => opt.value === selectedValue?.value)?.label ||
    placeholder;

  return (
    <View>
      <TouchableOpacity
        ref={selectorRef}
        onPress={() => setOpen(prev => !prev)}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          backgroundColor: colors.input,
          ...style,
        }}
      >
        <Text style={{ color: selectedValue.value === '' ? colors.textSecondary : colors.text, marginRight: 8 }}>
          {selectedLabel}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            top: 0,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            marginTop: 4,
            zIndex: 1000,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            maxHeight: 200,
            ...dropdownStyle,
          }}
        >
          <FlatList
            data={options}
            keyExtractor={item => item.value.toString()}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: String(item.value) === String(selectedValue.value)
                    ? colors.primary + '15'
                    : 'transparent',
                  ...itemStyle,
                }}
                activeOpacity={0.7}
              >

                <Text
                  style={{
                    color: String(item.value) === String(selectedValue.value)
                      ? colors.primary
                      : colors.text,
                    fontFamily: String(item.value) === String(selectedValue.value)
                      ? 'NunitoSemiBold'
                      : 'Nunito',
                    textAlign: 'left',
                  }}
                >
                  {item.label}
                </Text>
                {String(item.value) === String(selectedValue.value) && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};
