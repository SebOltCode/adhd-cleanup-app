import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "ADHD Cleanup",
  slug: "adhd-cleanup",
  version: "0.1.0",
  orientation: "portrait",
  scheme: "adhdcleanup",
  userInterfaceStyle: "automatic",
  splash: {
    resizeMode: "contain",
    backgroundColor: "#071333",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.example.adhdcleanup",
  },
  android: {
    package: "com.example.adhdcleanup",
    permissions: ["NOTIFICATIONS"],
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000",
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? "00000000-0000-0000-0000-000000000000",
    },
  },
  plugins: ["expo-notifications"],
});
