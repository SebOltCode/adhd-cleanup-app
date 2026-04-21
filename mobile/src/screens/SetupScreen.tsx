import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../providers/AuthProvider";

export const SetupScreen = () => {
  const { register, login, updateBaseUrl, apiBaseUrl } = useAuth();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [baseUrl, setBaseUrl] = useState(apiBaseUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setBaseUrl(apiBaseUrl);
  }, [apiBaseUrl]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateBaseUrl(baseUrl.trim());
      const normalizedBaseUrl = baseUrl.trim();
      if (mode === "register") {
        await register({ email, password, displayName: displayName || "Freund:in", baseUrl: normalizedBaseUrl });
      } else {
        await login({ email, password, baseUrl: normalizedBaseUrl });
      }
    } catch (error) {
      console.warn("Setup fehlgeschlagen", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = email.length > 3 && password.length >= 6 && (mode === "login" || displayName.length >= 2);

  return (
    <LinearGradient colors={["#071333", "#244b99"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 p-8 justify-center">
            <Text className="text-4xl font-bold text-white mb-2">Willkommen! 👋</Text>
            <Text className="text-white/80 text-base mb-8">
              Richte deine Wohnung ein, lass dir Micro-Tasks geben und belohne dich bei jedem Schritt.
            </Text>

            <View className="mb-4">
              <Text className="text-white/70 mb-2 text-sm">Server-Adresse</Text>
              <TextInput
                value={baseUrl}
                onChangeText={setBaseUrl}
                placeholder="http://192.168.0.10:4000"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                className="bg-white/10 rounded-2xl px-4 py-3 text-white"
              />
            </View>

            {mode === "register" && (
              <View className="mb-4">
                <Text className="text-white/70 mb-2 text-sm">Wie dürfen wir dich nennen?</Text>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Mara"
                  placeholderTextColor="#9ca3af"
                  className="bg-white/10 rounded-2xl px-4 py-3 text-white"
                />
              </View>
            )}

            <View className="mb-4">
              <Text className="text-white/70 mb-2 text-sm">E-Mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="du@beispiel.de"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-white/10 rounded-2xl px-4 py-3 text-white"
              />
            </View>

            <View className="mb-6">
              <Text className="text-white/70 mb-2 text-sm">Passwort</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mindestens 6 Zeichen"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="bg-white/10 rounded-2xl px-4 py-3 text-white"
              />
            </View>

            <TouchableOpacity
              disabled={!canSubmit || isSubmitting}
              onPress={handleSubmit}
              className="bg-white rounded-2xl py-4 items-center"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#244b99" />
              ) : (
                <Text className="text-[#071333] text-base font-semibold">
                  {mode === "register" ? "Account anlegen & starten" : "Einloggen"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-6"
              onPress={() => setMode(mode === "register" ? "login" : "register")}
            >
              <Text className="text-white text-center">
                {mode === "register"
                  ? "Ich habe schon einen Account"
                  : "Ich bin neu hier – Account erstellen"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};
