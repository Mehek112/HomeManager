// src/components/Card.js
import { View, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightGray,
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
});