import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import BASE_URL from "../src/config";

export default function DisplayQueryStaff() {
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/displayquerystaff`);

      if (Array.isArray(response.data)) {
        const updated = response.data.map((q) => ({
          ...q,
          photo:
            q.photo && !q.photo.startsWith("http")
              ? `${BASE_URL}/uploads/queries/${q.photo}`
              : q.photo,
        }));
        setQueries(updated);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openImage = (img: string) => {
    setSelectedImage(img);
    setIsModalVisible(true);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Query Display</Text>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {queries.map((query, index) => (
          <View key={index} style={styles.card}>

            {/* ==== IMAGE FIRST ==== */}
            {query.photo ? (
              <TouchableOpacity
                onPress={() => openImage(query.photo)}
                style={styles.imageWrapper}
              >
                <Image source={{ uri: query.photo }} style={styles.image} />
                <Text style={styles.tapText}>Tap to view photo</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noImage}>No image uploaded</Text>
            )}

            {/* ==== DETAILS ==== */}
            <Text style={styles.label}>
              Query ID: <Text style={styles.value}>{query.id}</Text>
            </Text>

            <Text style={styles.label}>
              Problem: <Text style={styles.value}>{query.problem_statement}</Text>
            </Text>

            <Text style={styles.label}>
              Description: <Text style={styles.value}>{query.description}</Text>
            </Text>

            <Text style={styles.label}>
              Name: <Text style={styles.value}>{query.name}</Text>
            </Text>

            <Text style={styles.label}>
              Phone: <Text style={styles.value}>{query.phone_number}</Text>
            </Text>

            <Text style={styles.label}>
              Company: <Text style={styles.value}>{query.company_name}</Text>
            </Text>

            <Text style={styles.label}>
              Email: <Text style={styles.value}>{query.email}</Text>
            </Text>

            {/* Assign Button */}
            <TouchableOpacity
              style={styles.assignBtn}
              onPress={() =>
                router.push({
                  pathname: "/ScheduleEngineer",
                  params: { queryId: query.id },
                })
              }
            >
              <Text style={styles.assignText}>Assign Call</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* ===== FULL IMAGE MODAL ===== */}
      <Modal visible={isModalVisible} transparent>
        <TouchableWithoutFeedback onPress={closeImage}>
          <View style={styles.modalContainer}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.closeText}>Tap anywhere to close</Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 15,
  },
  scrollView: {
    paddingBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
    elevation: 3,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  tapText: {
    marginTop: 5,
    textAlign: "center",
    color: "#2980b9",
    fontStyle: "italic",
  },
  label: {
    fontWeight: "600",
    color: "#444",
    marginTop: 5,
  },
  value: {
    color: "#000",
    fontWeight: "500",
  },
  assignBtn: {
    marginTop: 12,
    backgroundColor: "#3498db",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  assignText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noImage: {
    fontStyle: "italic",
    textAlign: "center",
    color: "#aaa",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "80%",
  },
  closeText: {
    color: "#fff",
    fontSize: 15,
    marginTop: 10,
  },
});
