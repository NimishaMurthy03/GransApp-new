import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import BASE_URL from "../src/config";

export default function ScheduleEngineer() {
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { queryId } = useLocalSearchParams();
  const router = useRouter();

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!selectedEngineer || !selectedDate || !selectedTime) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const formattedTime = selectedTime.toTimeString().split(" ")[0];

    try {
      await axios.post(`${BASE_URL}/api/assign-calls`, {
        query_id: queryId,
        assigned_engineer: selectedEngineer,
        scheduled_date: formattedDate,
        scheduled_time: formattedTime,
      });

      Alert.alert("Success", "Call assigned successfully!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to assign call.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Engineer:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedEngineer}
          onValueChange={(itemValue) => setSelectedEngineer(itemValue)}
        >
          <Picker.Item label="-- Select --" value="" />
          <Picker.Item label="Engineer 1" value="Engineer 1" />
          <Picker.Item label="Engineer 2" value="Engineer 2" />
          <Picker.Item label="Engineer 3" value="Engineer 3" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>
          {selectedDate
            ? `Date: ${selectedDate.toLocaleDateString()}`
            : "Select Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={selectedDate || new Date()}
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.buttonText}>
          {selectedTime
            ? `Time: ${selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Select Time"}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          mode="time"
          display="default"
          value={selectedTime || new Date()}
          onChange={onTimeChange}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Text style={styles.summary}>
          Selected Engineer: {selectedEngineer || "None"}
        </Text>
        <Text style={styles.summary}>
          Selected Date: {selectedDate?.toLocaleDateString() || "None"}
        </Text>
        <Text style={styles.summary}>
          Selected Time:{" "}
          {selectedTime
            ? selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "None"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green", marginTop: 20 }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Assign Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 10 }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  summary: {
    fontSize: 16,
    marginTop: 5,
  },
});
