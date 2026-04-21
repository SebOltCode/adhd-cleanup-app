import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useApiClient } from "../api/useApiClient";
import { useAuth } from "../providers/AuthProvider";
import { StatCard } from "../components/StatCard";
import { WeeklyChart } from "../components/WeeklyChart";
import { UserStatsResponse } from "../types/api";

export const StatsScreen = () => {
  const api = useApiClient();
  const { token } = useAuth();

  const { data, isFetching, refetch } = useQuery<UserStatsResponse>(
    ["user-stats"],
    async () => {
      const response = await api.get<UserStatsResponse>("/api/users/me");
      return response.data;
    },
    {
      enabled: Boolean(token),
    },
  );

  const level = data?.user.level ?? 1;
  const experience = data?.user.experience ?? 0;
  const progressWithinLevel = experience % 100;
  const progressPercent = Math.min(1, progressWithinLevel / 100);

  return (
    <View className="flex-1 bg-[#071333]">
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#071333", "#152f66"]} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white/70 text-sm">Level {level}</Text>
                <Text className="text-white text-3xl font-bold">Hallo {data?.user.displayName ?? "du"} 👋</Text>
              </View>
              <TouchableOpacity onPress={() => refetch()} disabled={isFetching} className="bg-white/10 px-4 py-2 rounded-full">
                <Text className="text-white text-sm">Aktualisieren</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white/10 rounded-3xl p-6 mb-6">
              <Text className="text-white/70 text-sm mb-2">XP bis Level-Up</Text>
              <View className="h-3 bg-white/10 rounded-full overflow-hidden">
                <View className="h-full bg-[#ff90e8]" style={{ width: `${progressPercent * 100}%` }} />
              </View>
              <Text className="text-white text-sm mt-2">{progressWithinLevel} / 100 XP</Text>
              <Text className="text-white text-sm mt-1">Streak 🔥 {data?.user.streak ?? 0} Tage</Text>
            </View>

            <View className="flex-row mb-4 space-x-3">
              <StatCard label="Räume" value={data?.stats.roomsCount ?? 0} accentColor="#4685ff" />
              <StatCard label="Diese Woche" value={data?.stats.completedThisWeek ?? 0} accentColor="#34d399" />
              <StatCard label="Gesamt" value={data?.stats.totalCompleted ?? 0} accentColor="#ff90e8" />
            </View>

            <View className="bg-white/10 rounded-3xl p-6">
              <Text className="text-white text-lg font-semibold">Deine Woche</Text>
              {isFetching && !data ? (
                <ActivityIndicator color="#ffffff" style={{ marginTop: 16 }} />
              ) : (
                <WeeklyChart data={data?.stats.weekOverview ?? []} />
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};
