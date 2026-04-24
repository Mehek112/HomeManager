// src/components/InputField.js
import { TextInput, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function InputField({ value, onChangeText, placeholder }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
});