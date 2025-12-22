import React from 'react';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { View } from 'react-native';
import * as S from './styles';

export interface PickerItem {
  label: string;
  value: string;
}

export interface PickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
}

export default function Picker({ 
  selectedValue, 
  onValueChange, 
  items, 
  placeholder = "Selecione..." 
}: PickerProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <RNPicker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={{
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          paddingHorizontal: 12,
        }}
      >
        <RNPicker.Item 
          label={placeholder} 
          value="" 
          enabled={false}
        />
        {items.map((item) => (
          <RNPicker.Item 
            key={item.value} 
            label={item.label} 
            value={item.value} 
          />
        ))}
      </RNPicker>
    </View>
  );
}