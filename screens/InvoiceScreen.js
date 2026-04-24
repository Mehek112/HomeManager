import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const C = {
  orange: "#F26419",
  gray: "#7A6E64",
  white: "#FFFFFF",
  border: "#E8E0D8",
  grayLight: "#F5F2EE",
};

export default function InvoiceScreen({ route, navigation }) {
  const { roomName, bills = [] } = route.params;

  const total = bills.reduce((sum, b) => {
    const val = parseInt(b.extra || "0");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <SafeAreaView style={s.safe}>

      {/* HEADER WITH BACK BUTTON */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={s.title}>{roomName} - Invoice</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={s.container}>

        {/* TABLE HEADER */}
        <View style={s.rowHeader}>
          <Text style={s.cellH}>Item</Text>
          <Text style={s.cellH}>Amount</Text>
        </View>

        {/* TABLE ROWS */}
        {bills.length === 0 ? (
          <Text style={s.empty}>No bills found</Text>
        ) : (
          bills.map((b) => (
            <View key={b.id} style={s.row}>
              <Text style={s.cell}>{b.name}</Text>
              <Text style={s.cell}>₹{b.extra}</Text>
            </View>
          ))
        )}

        {/* TOTAL */}
        <View style={s.totalBox}>
          <Text style={s.totalText}>TOTAL EXPENDITURE</Text>
          <Text style={s.totalAmount}>₹{total}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.grayLight },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderColor: C.border,
  },

  back: {
    color: C.orange,
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },

  container: { padding: 20 },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.orange,
    padding: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.white,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: C.border,
  },

  cellH: {
    color: C.white,
    fontWeight: "700",
  },

  cell: {
    color: "#000",
  },

  totalBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: C.orange,
    borderRadius: 10,
  },

  totalText: {
    color: "white",
    fontWeight: "600",
  },

  totalAmount: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 5,
  },

  empty: {
    marginTop: 20,
    color: C.gray,
  },
});