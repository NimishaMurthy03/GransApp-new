import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


const companies = ["Google", "Microsoft", "Amazon"];

export default function AssignEngineer() {
  const router = useRouter();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [assignedCompanies, setAssignedCompanies] = useState<string[]>([]);

  const toggleSelection = (company: string) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(company)
        ? prevSelected.filter((c) => c !== company)
        : [...prevSelected, company]
    );
  };

  const handleAssign = (company: string) => {
    if (!assignedCompanies.includes(company)) {
      setAssignedCompanies((prev) => [...prev, company]);
    }
    router.push("/ScheduleEngineer");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Companies</Text>

      {companies.map((company) => (
        <View key={company} style={styles.companyRow}>
          <TouchableOpacity
            onPress={() => toggleSelection(company)}
            style={styles.checkboxRow}
          >
            <View style={styles.checkbox}>
              {selectedCompanies.includes(company) && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </View>
            <Text style={styles.label}>{company}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => handleAssign(company)}
          >
            <Text style={styles.buttonText}>
              {assignedCompanies.includes(company)
                ? "View Assigned Engineer"
                : "Assign Engineer"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#3498db",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
  },
  label: {
    fontSize: 16,
  },
  assignButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
