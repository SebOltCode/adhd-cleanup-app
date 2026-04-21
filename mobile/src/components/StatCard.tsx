import { ReactNode } from "react";
import { Text, View } from "react-native";

type StatCardProps = {
  label: string;
  value: ReactNode;
  accentColor?: string;
};

export const StatCard = ({ label, value, accentColor = "#4685ff" }: StatCardProps) => (
  <View className="flex-1 rounded-2xl p-4" style={{ backgroundColor: `${accentColor}15` }}>
    <Text className="text-xs uppercase tracking-wide text-white/80">{label}</Text>
    <Text className="text-2xl font-semibold text-white mt-1">{value}</Text>
  </View>
);
