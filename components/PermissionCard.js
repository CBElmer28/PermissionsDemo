import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PermissionCard({ icon, title, status, message }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text
        style={[
          styles.status,
          status === "granted"
            ? styles.granted
            : status === "denied"
            ? styles.denied
            : styles.pending,
        ]}
      >
        {status === "granted"
          ? "Permitido"
          : status === "denied"
          ? "Denegado"
          : "Pendiente"}
      </Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { fontSize: 30 },
  title: { fontSize: 18, fontWeight: "600", marginTop: 5 },
  status: { marginTop: 8, fontWeight: "500" },
  granted: { color: "green" },
  denied: { color: "red" },
  pending: { color: "orange" },
  message: { marginTop: 5, fontStyle: "italic", textAlign: "center" },
});
