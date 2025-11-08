import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PermissionCard from "./components/PermissionCard";

export default function App() {
  const [permissions, setPermissions] = useState({
    camera: null,
    location: null,
    microphone: null,
    media: null,
    notifications: null,
  });

  const [location, setLocation] = useState(null);

  useEffect(() => {
    loadSavedPermissions();
  }, []);

  const loadSavedPermissions = async () => {
    const saved = await AsyncStorage.getItem("permissions");
    if (saved) {
      setPermissions(JSON.parse(saved));
    }
  };

  const requestPermissions = async () => {
    try {
      const cam = await Camera.requestCameraPermissionsAsync();
      const loc = await Location.requestForegroundPermissionsAsync();
      const mic = await Audio.requestPermissionsAsync();
      const med = await MediaLibrary.requestPermissionsAsync();
      const noti = await Notifications.requestPermissionsAsync();

      const updated = {
        camera: cam.status,
        location: loc.status,
        microphone: mic.status,
        media: med.status,
        notifications: noti.status,
      };

      setPermissions(updated);
      await AsyncStorage.setItem("permissions", JSON.stringify(updated));

      if (loc.status === "granted") {
        const current = await Location.getCurrentPositionAsync({});
        setLocation(current.coords);
      }

      Alert.alert("✅ Permisos actualizados", "Se han solicitado los permisos correctamente.");
    } catch (error) {
      Alert.alert("⚠️ Error", "Ocurrió un problema al solicitar permisos.");
    }
  };

  const showAlertIfDenied = () => {
    const denied = Object.entries(permissions).filter(([_, status]) => status === "denied");
    if (denied.length > 0) {
      Alert.alert(
        "🚫 Permisos Denegados",
        denied.map(([key]) => `• ${key}`).join("\n"),
        [{ text: "Entendido" }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔒 Pantalla de Permisos</Text>
      <Text style={styles.subtitle}>
        Esta app requiere permisos para funcionar correctamente.
      </Text>

      <PermissionCard
        icon="🎥"
        title="Cámara"
        status={permissions.camera}
        message="Necesario para tomar fotos o escanear códigos."
      />
      <PermissionCard
        icon="📍"
        title="Ubicación"
        status={permissions.location}
        message="Usada para determinar tu posición actual."
      />
      <PermissionCard
        icon="🎤"
        title="Micrófono"
        status={permissions.microphone}
        message="Requerido para grabar notas de voz o videollamadas."
      />
      <PermissionCard
        icon="🗂️"
        title="Archivos"
        status={permissions.media}
        message="Permite guardar y acceder a tus archivos multimedia."
      />
      <PermissionCard
        icon="🔔"
        title="Notificaciones"
        status={permissions.notifications}
        message="Usadas para enviarte recordatorios o alertas."
      />

      {location && (
        <Text style={styles.coords}>
          📡 Lat: {location.latitude.toFixed(4)} | Lon: {location.longitude.toFixed(4)}
        </Text>
      )}

      <View style={styles.buttons}>
        <Button title="Solicitar permisos" onPress={requestPermissions} />
        <Button title="Mostrar alertas denegadas" color="red" onPress={showAlertIfDenied} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F6F8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  coords: {
    marginTop: 10,
    fontSize: 15,
    fontStyle: "italic",
  },
  buttons: {
    width: "100%",
    marginTop: 25,
    gap: 10,
  },
});
