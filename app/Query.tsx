import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useRouter } from "expo-router";
import BASE_URL from "../src/config";

export default function PostQuery() {
  const router = useRouter();

  const [problemStatement, setProblemStatement] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ------------------ PICK IMAGE ------------------
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ------------------ SUBMIT FORM ------------------
  const handleSubmit = async () => {
  if (!problemStatement || !description || !name || !phone || !companyName || !email) {
    Alert.alert("Error", "All fields are required.");
    return;
  }

  if (!image) {
    Alert.alert("Error", "Please upload a photo.");
    return;
  }

  const formData = new FormData();
  formData.append("problem_statement", problemStatement);
  formData.append("description", description);
  formData.append("company_name", companyName);
  formData.append("phone_number", phone);
  formData.append("name", name);
  formData.append("email", email);

  // ---- SAFE FILENAME ----
  const uriParts = image.split(".");
const fileType = uriParts[uriParts.length - 1];

formData.append(
  "photo",
  {
    uri: image,
    name: `photo_${Date.now()}.${fileType}`,
    type: `image/${fileType}`,
  } as any   // ← THIS FIXES TS ERROR
);



  

  setLoading(true);

  try {
    const response = await axios.post(`${BASE_URL}/api/postQuery`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Alert.alert("Success", "Query submitted successfully!");
    router.push("/Query");
  } catch (error: any) {
    console.log("FULL ERROR:", JSON.stringify(error?.response?.data ?? error, null, 2));
    Alert.alert("Error", "Failed to submit query.");
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Submit Your Query</Text>

      <Text style={styles.label}>Problem Statement</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={problemStatement}
          style={styles.picker}
          onValueChange={(itemValue) => setProblemStatement(itemValue)}
        >
          <Picker.Item label="Select a problem" value="" />
          <Picker.Item label="Technical Issue" value="Technical Issue" />
          <Picker.Item label="Billing Issue" value="Billing Issue" />
          <Picker.Item label="General Query" value="General Query" />
        </Picker>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Describe the issue"
      />

      <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
        <Text style={styles.cameraButtonText}>📸 Upload Photo</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Company</Text>
      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {loading ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fafafa" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  label: { marginTop: 12, fontWeight: "600" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 10,
  },
  picker: { height: 50 },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 100,
    backgroundColor: "white",
    padding: 10,
  },
  cameraButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  cameraButtonText: { color: "white", fontWeight: "bold" },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
