import { useState } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import Card from "../components/Card";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTask },
    ]);

    setNewTask("");
    setModalVisible(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={tasks}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card>
            <Text>{item.title}</Text>
          </Card>
        )}
      />

      <CustomButton title="+ Add Task" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible}>
        <View style={{ padding: 20 }}>
          <InputField
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Task"
          />
          <CustomButton title="Save" onPress={addTask} />
        </View>
      </Modal>
    </View>
  );
}