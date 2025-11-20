import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import BASE_URL from "../src/config";
import { useRouter } from "expo-router";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [engineers, setEngineers] = useState<{ name: string; editing: boolean }[]>([]);
  const [staffList, setStaffList] = useState<
    { name: string; role: string; email: string; phone: string; editing: boolean }[]
  >([]);

  const [newEngineer, setNewEngineer] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/displayquerystaff`);
      if (Array.isArray(response.data)) {
        setQueries(response.data);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "calls") {
      fetchQueries();
    }
  }, [activeSection]);

  const handleViewCalls = () => setActiveSection("calls");
  const handleManageEngineers = () => setActiveSection("engineers");
  const handleManageStaff = () => setActiveSection("staff");

  const addEngineer = () => {
    if (!newEngineer.trim()) {
      Alert.alert("Error", "Please enter an engineer name");
      return;
    }
    setEngineers([...engineers, { name: newEngineer.trim(), editing: false }]);
    setNewEngineer("");
  };

  const addStaff = () => {
    if (!newStaffName || !newStaffRole || !newStaffEmail || !newStaffPhone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setStaffList([
      ...staffList,
      {
        name: newStaffName.trim(),
        role: newStaffRole.trim(),
        email: newStaffEmail.trim(),
        phone: newStaffPhone.trim(),
        editing: false,
      },
    ]);

    setNewStaffName("");
    setNewStaffRole("");
    setNewStaffEmail("");
    setNewStaffPhone("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Super Admin Dashboard</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.mainButton, activeSection === "calls" && styles.activeButton]}
          onPress={handleViewCalls}
        >
          <Text style={styles.buttonText}>View Calls</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, activeSection === "engineers" && styles.activeButton]}
          onPress={handleManageEngineers}
        >
          <Text style={styles.buttonText}>Manage Engineers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, activeSection === "staff" && styles.activeButton]}
          onPress={handleManageStaff}
        >
          <Text style={styles.buttonText}>Manage Office Staff</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {activeSection === "calls" && (
          <>
            {loading ? (
              <ActivityIndicator size="large" color="#6c5ce7" style={{ marginTop: 30 }} />
            ) : queries.length > 0 ? (
              queries.map((query, index) => (
                <View key={index} style={styles.queryCard}>

                  <Text style={styles.queryLabel}>
                    Query ID: <Text style={styles.queryText}>{query.id}</Text>
                  </Text>

                  <Text style={styles.queryLabel}>
                    Problem Statement:{" "}
                    <Text style={styles.queryText}>{query.problem_statement}</Text>
                  </Text>

                  <Text style={styles.queryLabel}>
                    Description:{" "}
                    <Text style={styles.queryText}>{query.description}</Text>
                  </Text>

                  <Text style={styles.queryLabel}>
                    Name: <Text style={styles.queryText}>{query.name}</Text>
                  </Text>

                  <Text style={styles.queryLabel}>
                    Phone: <Text style={styles.queryText}>{query.phone_number}</Text>
                  </Text>

                  <Text style={styles.queryLabel}>
                    Company:{" "}
                    <Text style={styles.queryText}>{query.company_name}</Text>
                  </Text>

                  <Text style={styles.queryLabel}>
                    Email: <Text style={styles.queryText}>{query.email}</Text>
                  </Text>

                  <View style={styles.actionRow}>

                    {/* ⭐ UPDATED ASSIGN BUTTON WITH CALL ASSIGNED LOGIC ⭐ */}
                    <TouchableOpacity
                      disabled={query.has_assigned_call}
                      style={[
                        styles.actionButton,
                        query.has_assigned_call
                          ? { backgroundColor: "grey" }
                          : { backgroundColor: "#27ae60" },
                      ]}
                      onPress={() => {
                        if (!query.has_assigned_call) {
                          router.push({
                            pathname: "/ScheduleEngineer",
                            params: { queryId: query.id },
                          });
                        }
                      }}
                    >
                      <Text style={styles.actionText}>
                        {query.has_assigned_call ? "Call Assigned" : "Assign Call"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: "#f1c40f" }]}
                      onPress={() => Alert.alert("Edit Call")}
                    >
                      <Text style={styles.actionText}>Edit Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: "#e74c3c" }]}
                      onPress={() => Alert.alert("Pending Status")}
                    >
                      <Text style={styles.actionText}>Check Pending</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No Calls Found</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ========= STYLES ========= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef1f8", padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 15,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  mainButton: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 14,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
  activeButton: { backgroundColor: "#00b894" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  queryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  queryLabel: { color: "#636e72", fontWeight: "600" },
  queryText: { color: "#2d3436" },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "bold" },
  noDataText: { textAlign: "center", color: "#636e72", marginTop: 20 },
});
