import React, { useState } from "react";
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

export default function SuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [engineers, setEngineers] = useState<
    { name: string; editing: boolean }[]
  >([]);
  const [staffList, setStaffList] = useState<
    {
      name: string;
      role: string;
      email: string;
      phone: string;
      editing: boolean;
    }[]
  >([]);

  const [newEngineer, setNewEngineer] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  // ======= FETCH QUERIES (Same as DisplayQueryStaff) =======
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/displayquerystaff`, {
        headers: { "Content-Type": "text/plain" },
      });
      if (Array.isArray(response.data)) {
        setQueries(response.data);
      } else {
        console.warn("Unexpected response:", response.data);
        setQueries([]);
      }
    } catch (error: any) {
      console.error("Error fetching queries:", error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  // ======= MAIN NAVIGATION =======
  const handleViewCalls = async () => {
    setActiveSection("calls");
    await fetchQueries();
  };

  const handleManageEngineers = () => setActiveSection("engineers");
  const handleManageStaff = () => setActiveSection("staff");

  // ======= CALL ACTIONS =======
  const handleAssignCall = (id: string) =>
    Alert.alert("Assign Call", `Assigning call for ID: ${id}`);
  const handleEditCall = (id: string) =>
    Alert.alert("Edit Call", `Editing call ID: ${id}`);
  const handlePendingStatus = (id: string) =>
    Alert.alert("Pending Status", `Checking pending status for ID: ${id}`);

  // ======= ENGINEER ACTIONS =======
  const addEngineer = () => {
    if (!newEngineer.trim()) {
      Alert.alert("Error", "Please enter an engineer name");
      return;
    }
    setEngineers((prev) => [
      ...prev,
      { name: newEngineer.trim(), editing: false },
    ]);
    setNewEngineer("");
  };

  const toggleEngineerEdit = (index: number) => {
    setEngineers((prev) =>
      prev.map((e, i) =>
        i === index ? { ...e, editing: !e.editing } : { ...e }
      )
    );
  };

  const updateEngineerName = (index: number, newName: string) => {
    setEngineers((prev) =>
      prev.map((e, i) => (i === index ? { ...e, name: newName } : e))
    );
  };

  const viewEngineerCalls = (engineerName: string) => {
    Alert.alert("Assigned Calls", `Viewing calls assigned to ${engineerName}`);
  };

  // ======= OFFICE STAFF ACTIONS =======
  const addStaff = () => {
    if (
      !newStaffName.trim() ||
      !newStaffRole.trim() ||
      !newStaffEmail.trim() ||
      !newStaffPhone.trim()
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setStaffList((prev) => [
      ...prev,
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

  const toggleStaffEdit = (index: number) => {
    setStaffList((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, editing: !s.editing } : { ...s }
      )
    );
  };

  const updateStaffField = (
    index: number,
    field: "name" | "role" | "email" | "phone",
    value: string
  ) => {
    setStaffList((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  // ======= UI =======
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Super Admin Dashboard</Text>

      {/* Top Navigation Buttons */}
      <View style={styles.buttonRow}>
        {[
          { label: "View Calls", section: "calls", action: handleViewCalls },
          {
            label: "Manage Engineers",
            section: "engineers",
            action: handleManageEngineers,
          },
          {
            label: "Manage Office Staff",
            section: "staff",
            action: handleManageStaff,
          },
        ].map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.mainButton,
              activeSection === btn.section && styles.activeButton,
            ]}
            onPress={btn.action}
          >
            <Text style={styles.buttonText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* ===== VIEW CALLS SECTION ===== */}
        {activeSection === "calls" && (
          <>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#6c5ce7"
                style={{ marginTop: 30 }}
              />
            ) : queries.length > 0 ? (
              queries.map((query, index) => (
                <View key={index} style={styles.queryCard}>
                  <Text style={styles.queryLabel}>
                    Query ID: <Text style={styles.queryText}>{query.id}</Text>
                  </Text>
                  <Text style={styles.queryLabel}>
                    Problem Statement:{" "}
                    <Text style={styles.queryText}>
                      {query.problem_statement}
                    </Text>
                  </Text>
                  <Text style={styles.queryLabel}>
                    Description:{" "}
                    <Text style={styles.queryText}>{query.description}</Text>
                  </Text>
                  <Text style={styles.queryLabel}>
                    Name: <Text style={styles.queryText}>{query.name}</Text>
                  </Text>
                  <Text style={styles.queryLabel}>
                    Phone:{" "}
                    <Text style={styles.queryText}>{query.phone_number}</Text>
                  </Text>
                  <Text style={styles.queryLabel}>
                    Company:{" "}
                    <Text style={styles.queryText}>{query.company_name}</Text>
                  </Text>
                  <Text style={styles.queryLabel}>
                    Email: <Text style={styles.queryText}>{query.email}</Text>
                  </Text>

                  {/* ===== 3 BUTTONS FOR EACH CALL ===== */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#27ae60" },
                      ]}
                      onPress={() => handleAssignCall(query.id)}
                    >
                      <Text style={styles.actionText}>Assign Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#f1c40f" },
                      ]}
                      onPress={() => handleEditCall(query.id)}
                    >
                      <Text style={styles.actionText}>Edit Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#e74c3c" },
                      ]}
                      onPress={() => handlePendingStatus(query.id)}
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

        {/* ===== MANAGE ENGINEERS ===== */}
        {activeSection === "engineers" && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Add Engineer</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Engineer Name"
              value={newEngineer}
              onChangeText={setNewEngineer}
            />
            <TouchableOpacity style={styles.addButton} onPress={addEngineer}>
              <Text style={styles.addButtonText}>+ Add Engineer</Text>
            </TouchableOpacity>

            {engineers.length > 0 ? (
              engineers.map((eng, idx) => (
                <View key={idx} style={styles.listCard}>
                  {eng.editing ? (
                    <TextInput
                      style={styles.editInput}
                      value={eng.name}
                      onChangeText={(txt) => updateEngineerName(idx, txt)}
                    />
                  ) : (
                    <Text style={styles.listItem}>⚙️ {eng.name}</Text>
                  )}
                  <View style={styles.subActionRow}>
                    <TouchableOpacity
                      style={[styles.smallButton, { backgroundColor: "#f39c12" }]}
                      onPress={() => toggleEngineerEdit(idx)}
                    >
                      <Text style={styles.smallButtonText}>
                        {eng.editing ? "Save" : "Edit"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallButton, { backgroundColor: "#3498db" }]}
                      onPress={() => viewEngineerCalls(eng.name)}
                    >
                      <Text style={styles.smallButtonText}>View Calls</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No Engineers Added Yet</Text>
            )}
          </View>
        )}

        {/* ===== MANAGE OFFICE STAFF ===== */}
        {activeSection === "staff" && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Add Office Staff</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Staff Name"
              value={newStaffName}
              onChangeText={setNewStaffName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Designation"
              value={newStaffRole}
              onChangeText={setNewStaffRole}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              keyboardType="email-address"
              value={newStaffEmail}
              onChangeText={setNewStaffEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              value={newStaffPhone}
              onChangeText={setNewStaffPhone}
            />

            <TouchableOpacity style={styles.addButton} onPress={addStaff}>
              <Text style={styles.addButtonText}>+ Add Office Staff</Text>
            </TouchableOpacity>

            {staffList.length > 0 ? (
              staffList.map((staff, idx) => (
                <View key={idx} style={styles.listCard}>
                  {staff.editing ? (
                    <>
                      <TextInput
                        style={styles.editInput}
                        value={staff.name}
                        onChangeText={(txt) => updateStaffField(idx, "name", txt)}
                        placeholder="Name"
                      />
                      <TextInput
                        style={styles.editInput}
                        value={staff.role}
                        onChangeText={(txt) => updateStaffField(idx, "role", txt)}
                        placeholder="Designation"
                      />
                      <TextInput
                        style={styles.editInput}
                        value={staff.email}
                        onChangeText={(txt) => updateStaffField(idx, "email", txt)}
                        placeholder="Email"
                      />
                      <TextInput
                        style={styles.editInput}
                        value={staff.phone}
                        onChangeText={(txt) => updateStaffField(idx, "phone", txt)}
                        placeholder="Phone Number"
                      />
                    </>
                  ) : (
                    <Text style={styles.listItem}>
                      👤 {staff.name} — {staff.role}{"\n"}
                      📧 {staff.email}{"\n"}
                      📞 {staff.phone}
                    </Text>
                  )}

                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: "#9b59b6" }]}
                    onPress={() => toggleStaffEdit(idx)}
                  >
                    <Text style={styles.smallButtonText}>
                      {staff.editing ? "Save" : "Edit"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No Office Staff Added Yet</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ===== STYLES =====
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
  sectionBox: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0984e3",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
  },
  addButton: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  listCard: {
    backgroundColor: "#f5f6fa",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  listItem: { fontSize: 16, color: "#2d3436", marginBottom: 8 },
  subActionRow: { flexDirection: "row", justifyContent: "space-between" },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  smallButtonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  editInput: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 6,
    padding: 6,
    backgroundColor: "#fff",
    marginBottom: 6,
  },
});
