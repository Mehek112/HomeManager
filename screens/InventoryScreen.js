import { useState } from "react";
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

export default function InventoryScreen({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [bills, setBills] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeType, setActiveType] = useState("");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const openModal = (type) => {
    setActiveType(type);
    setModalVisible(true);
  };

  const addItem = () => {
    if (!input1.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: input1,
      extra: input2,
    };

    if (activeType === "inventory") {
      setInventory((prev) => [...prev, newItem]);
    } else if (activeType === "task") {
      setTasks((prev) => [...prev, { ...newItem, done: false }]);
    } else if (activeType === "bill") {
      setBills((prev) => [...prev, newItem]);
    }

    setInput1("");
    setInput2("");
    setModalVisible(false);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <SafeAreaView style={s.safe}>

      {/* 🔥 HEADER WITH BACK BUTTON */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
        >
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={s.headerTitle}>Inventory</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={s.container}>

        {/* INVENTORY */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>INVENTORY</Text>
        </View>

        {inventory.length === 0 ? (
          <Text style={s.empty}>No items yet</Text>
        ) : (
          inventory.map((item) => (
            <View key={item.id} style={s.card}>
              <Text style={s.text}>{item.name}</Text>
            </View>
          ))
        )}

        <TouchableOpacity
          style={s.addBtn}
          onPress={() => openModal("inventory")}
        >
          <Text style={s.addText}>+ Add Item</Text>
        </TouchableOpacity>

        {/* TASKS */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>TASKS</Text>
        </View>

        {tasks.length === 0 ? (
          <Text style={s.empty}>No tasks yet</Text>
        ) : (
          tasks.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.taskCard}
              onPress={() => toggleTask(item.id)}
            >
              <View style={[s.checkbox, item.done && s.checked]} />
              <Text
                style={[
                  s.text,
                  item.done && {
                    textDecorationLine: "line-through",
                    color: C.gray,
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={s.addBtn}
          onPress={() => openModal("task")}
        >
          <Text style={s.addText}>+ Add Task</Text>
        </TouchableOpacity>

        {/* BILLS */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>BILLS</Text>
        </View>

        {bills.length === 0 ? (
          <Text style={s.empty}>No bills yet</Text>
        ) : (
          bills.map((item) => (
            <View key={item.id} style={s.card}>
              <Text style={s.text}>
                {item.name} - ₹{item.extra}
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity
          style={s.addBtn}
          onPress={() => openModal("bill")}
        >
          <Text style={s.addText}>+ Add Bill</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.handle} />

            <Text style={s.sheetTitle}>
              Add {activeType}
            </Text>

            <TextInput
              style={s.input}
              value={input1}
              onChangeText={setInput1}
              placeholder="Enter name"
              placeholderTextColor={C.gray}
            />

            {activeType === "bill" && (
              <TextInput
                style={s.input}
                value={input2}
                onChangeText={setInput2}
                placeholder="Amount"
                placeholderTextColor={C.gray}
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderColor: C.border,
  },

  backBtn: {
    padding: 8,
  },

  backText: {
    color: C.orange,
    fontSize: 16,
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.black,
  },

  container: { padding: 20 },

  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1,
    color: C.gray,
  },

  card: {
    backgroundColor: C.white,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 10,
    marginRight: 10,
  },

  checked: {
    backgroundColor: C.orange,
    borderColor: C.orange,
  },

  text: {
    fontSize: 14,
    color: C.black,
  },

  empty: {
    color: C.gray,
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: C.orangeLight,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  addText: {
    color: C.orangeDark,
    fontWeight: "500",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(26,18,8,0.5)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: C.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: C.grayLight,
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: C.grayLight,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelText: {
    color: C.gray,
  },

  saveBtn: {
    flex: 2,
    backgroundColor: C.orange,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  saveText: {
    color: C.white,
    fontWeight: "600",
  },
});