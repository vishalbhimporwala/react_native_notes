import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, {ForwardedRef} from 'react';

type InputFieldProps = {
  placeHolder: string;
  text: string;
  onChangeText: (text: string) => void;
  textColor?: string;
  inputType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  keyboardSubmit?: ReturnKeyTypeOptions;
  inputRef?: ForwardedRef<TextInput>;
  onSubmitEditing?: () => void;
};

const InputField = ({
  placeHolder,
  text,
  onChangeText,
  textColor,
  inputType,
  secureTextEntry,
  inputRef,
  keyboardSubmit,
  onSubmitEditing,
}: InputFieldProps) => {
  return (
    <TextInput
      style={[styles.input, {color: textColor || '#000'}]}
      ref={inputRef}
      placeholder={placeHolder}
      placeholderTextColor="#999"
      value={text}
      returnKeyType={keyboardSubmit || 'next'}
      onChangeText={onChangeText}
      keyboardType={inputType || 'default'}
      secureTextEntry={secureTextEntry || false}
      onSubmitEditing={onSubmitEditing}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
});

export default InputField;
