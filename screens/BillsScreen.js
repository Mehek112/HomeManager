import { useState } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import Card from "../components/Card";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";

export default function BillsScreen() {
  const [bills, setBills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addBill = () => {
    if (!name.trim() || !amount.trim()) return;

    setBills((prev) => [
      ...prev,
      { id: Date.now().toString(), name, amount },
    ]);

    setName("");
    setAmount("");
    setModalVisible(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={bills}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card>
            <Text>
              {item.name} - ₹{item.amount}
            </Text>
          </Card>
        )}
      />

      <CustomButton title="+ Add Bill" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible}>
        <View style={{ padding: 20 }}>
          <InputField
            value={name}
            onChangeText={setName}
            placeholder="Bill name"
          />
          <InputField
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount"
          />
          <CustomButton title="Save" onPress={addBill} />
        </View>
      </Modal>
    </View>
  );
}