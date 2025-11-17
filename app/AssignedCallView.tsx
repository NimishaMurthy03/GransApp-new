import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import BASE_URL from "../src/config";

export default function AssignedCallView() {
  const { queryId } = useLocalSearchParams();
  const [assignedCall, setAssignedCall] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAssignedCall();
  }, []);

  const fetchAssignedCall = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/assign-calls/query/${queryId}`
      );
      setAssignedCall(response.data);
    } catch (error) {
      console.error("Error fetching assigned call:", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this assigned call?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `${BASE_URL}/api/delete-assigned-call/${queryId}`
              );
              Alert.alert("Success", "Assigned call deleted.");
              router.back();
            } catch (error) {
              console.error("Delete error:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Call Details</Text>

      {assignedCall ? (
        <View style={styles.card}>
          <Text style={styles.label}>Engineer:</Text>
          <Text style={styles.value}>{assignedCall.assigned_engineer}</Text>

          <Text style={styles.label}>Scheduled Date:</Text>
          <Text style={styles.value}>{assignedCall.scheduled_date}</Text>

          <Text style={styles.label}>Scheduled Time:</Text>
          <Text style={styles.value}>{assignedCall.scheduled_time}</Text>

          <View style={styles.actions}>
            {/* <TouchableOpacity
              style={[styles.button, { backgroundColor: "#2980b9" }]}
              onPress={() =>
                router.push({
                  pathname: "/EditAssignedCall",
                  params: { queryId },
                })
              }
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#e74c3c" }]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.loading}>Loading assigned call...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#34495e",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  button: {
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
  },
});
