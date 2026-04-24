import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  orange: "#F26419",
  orangeLight: "#FFF0E8",
  orangeMid: "#FDDCCA",
  orangeDark: "#C04A0C",
  black: "#1A1208",
  gray: "#7A6E64",
  grayLight: "#F5F2EE",
  white: "#FFFFFF",
  border: "#E8E0D8",
};

export default function InventoryScreen({ route, navigation }) {
  const { roomId, roomName } = route.params;

  const INV_KEY = `inventory_${roomId}`;
  const TASK_KEY = `tasks_${roomId}`;
  const BILL_KEY = `bills_${roomId}`;

  const [inventory, setInventory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [bills, setBills] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeType, setActiveType] = useState("");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const inv = await AsyncStorage.getItem(INV_KEY);
      const tsk = await AsyncStorage.getItem(TASK_KEY);
      const bil = await AsyncStorage.getItem(BILL_KEY);

      if (inv) setInventory(JSON.parse(inv));
      if (tsk) setTasks(JSON.parse(tsk));
      if (bil) setBills(JSON.parse(bil));
    } catch (e) {
      console.log("Load error:", e);
    }
  };

  const save = async (key, data) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  };

  /* ================= BILL VALIDATION ================= */
  const isValidNumber = (value) => {
    return /^\d+$/.test(value); // only digits
  };

  const addItem = async () => {
    if (!input1.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: input1,
      extra: input2,
    };

    if (activeType === "inventory") {
      const updated = [...inventory, newItem];
      setInventory(updated);
      await save(INV_KEY, updated);
    }

    if (activeType === "task") {
      const updated = [...tasks, { ...newItem, done: false }];
      setTasks(updated);
      await save(TASK_KEY, updated);
    }

    if (activeType === "bill") {
      if (!isValidNumber(input2)) {
        alert("Bill amount must contain numbers only");
        return;
      }

      const updated = [...bills, newItem];
      setBills(updated);
      await save(BILL_KEY, updated);
    }

    setInput1("");
    setInput2("");
    setModalVisible(false);
  };

  const toggleTask = async (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
    await save(TASK_KEY, updated);
  };

  const deleteItem = async (type, id) => {
    if (type === "inventory") {
      const updated = inventory.filter((i) => i.id !== id);
      setInventory(updated);
      await save(INV_KEY, updated);
    }

    if (type === "task") {
      const updated = tasks.filter((i) => i.id !== id);
      setTasks(updated);
      await save(TASK_KEY, updated);
    }

    if (type === "bill") {
      const updated = bills.filter((i) => i.id !== id);
      setBills(updated);
      await save(BILL_KEY, updated);
    }
  };

  const totalBills = bills.reduce((sum, b) => {
    const val = parseInt(b.extra || "0");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const openModal = (type) => {
    setActiveType(type);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={s.safe}>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={s.headerTitle}>{roomName}</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={s.container}>

        {/* INVENTORY */}
        <Text style={s.sectionTitle}>INVENTORY</Text>

        {inventory.length === 0 ? (
          <Text style={s.empty}>No items yet</Text>
        ) : (
          inventory.map((item) => (
            <View key={item.id} style={s.cardRow}>
              <Text style={s.text}>{item.name}</Text>
              <TouchableOpacity onPress={() => deleteItem("inventory", item.id)}>
                <Text style={s.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={s.addBtn} onPress={() => openModal("inventory")}>
          <Text style={s.addText}>+ Add Item</Text>
        </TouchableOpacity>

        {/* TASKS */}
        <Text style={s.sectionTitle}>TASKS</Text>

        {tasks.length === 0 ? (
          <Text style={s.empty}>No tasks yet</Text>
        ) : (
          tasks.map((item) => (
            <View key={item.id} style={s.taskRow}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
                onPress={() => toggleTask(item.id)}
              >
                <View style={[s.checkbox, item.done && s.checked]} />
                <Text style={[s.text, item.done && s.done]}>
                  {item.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteItem("task", item.id)}>
                <Text style={s.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={s.addBtn} onPress={() => openModal("task")}>
          <Text style={s.addText}>+ Add Task</Text>
        </TouchableOpacity>

        {/* BILLS */}
        <Text style={s.sectionTitle}>BILLS (TOTAL: ₹{totalBills})</Text>

        {bills.length === 0 ? (
          <Text style={s.empty}>No bills yet</Text>
        ) : (
          bills.map((item) => (
            <View key={item.id} style={s.cardRow}>
              <Text style={s.text}>
                {item.name} - ₹{item.extra}
              </Text>
              <TouchableOpacity onPress={() => deleteItem("bill", item.id)}>
                <Text style={s.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={s.addBtn} onPress={() => openModal("bill")}>
          <Text style={s.addText}>+ Add Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={s.invoiceLink}
  onPress={() =>
    navigation.navigate("InvoiceScreen", {
      roomId,
      roomName,
      bills,
    })
  }
>
  <Text style={s.invoiceText}>
    📊 View Total Invoice / Expenditure →
  </Text>
</TouchableOpacity>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.sheet}>

            <Text style={s.sheetTitle}>Add {activeType}</Text>

            <TextInput
              style={s.input}
              value={input1}
              onChangeText={setInput1}
              placeholder="Enter name"
            />

            {activeType === "bill" && (
              <TextInput
                style={s.input}
                value={input2}
                onChangeText={setInput2}
                placeholder="Amount (numbers only)"
                keyboardType="numeric"
              />
            )}

            <View style={s.actions}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.saveBtn} onPress={addItem}>
                <Text style={s.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.grayLight },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderColor: C.border,
  },

  invoiceLink: {
  marginTop: 10,
  marginBottom: 20,
},

invoiceText: {
  color: C.orangeDark,
  fontWeight: "600",
},

  backText: {
    color: C.orange,
    fontSize: 16,
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  container: { padding: 20 },

  sectionTitle: {
    fontSize: 12,
    color: C.gray,
    marginTop: 20,
    marginBottom: 10,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
  },

  checked: { backgroundColor: C.orange },

  text: { fontSize: 14 },

  done: { textDecorationLine: "line-through", color: C.gray },

  delete: { fontSize: 18 },

  empty: { color: C.gray },

  addBtn: {
    backgroundColor: C.orangeLight,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  addText: { color: C.orangeDark },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: C.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: C.grayLight,
    borderRadius: 8,
  },

  saveBtn: {
    flex: 2,
    padding: 12,
    backgroundColor: C.orange,
    borderRadius: 8,
  },

  saveText: { color: C.white, textAlign: "center" },

  cancelText: { textAlign: "center" },
});