// src/components/CustomButton.js
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
  },
});