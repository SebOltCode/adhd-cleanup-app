import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useApiClient } from "../api/useApiClient";
import { useCelebration } from "../hooks/useCelebration";
import { TaskCard } from "../components/TaskCard";
import { CelebrationOverlay } from "../components/CelebrationOverlay";
import { CompleteTaskResponse, DeferTaskResponse, NextTaskResponse } from "../types/api";
import { useAuth } from "../providers/AuthProvider";

export const TaskScreen = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { triggerCelebration, isCelebrating } = useCelebration();
  const { refreshUser } = useAuth();

  const { data, isLoading, refetch, isRefetching } = useQuery<NextTaskResponse>(
    ["next-task"],
    async () => {
      const response = await api.get<NextTaskResponse>("/api/tasks/next");
      return response.data;
    },
    {
      staleTime: 30_000,
    },
  );

  const deferMutation = useMutation(
    async (taskId: string) => {
      const response = await api.post<DeferTaskResponse>(`/api/tasks/${taskId}/defer`);
      return response.data;
    },
    {
      onSuccess: (result) => {
        queryClient.setQueryData<NextTaskResponse>(["next-task"], {
          task: result.nextTask,
          pendingCount: result.pendingCount,
        });
      },
    },
  );

  const mutation = useMutation(
    async (taskId: string) => {
      const response = await api.post<CompleteTaskResponse>(`/api/tasks/${taskId}/complete`);
      return response.data;
    },
    {
      onSuccess: async (result) => {
        triggerCelebration();
        await refreshUser();
        await queryClient.invalidateQueries({ queryKey: ["user-stats"] });
        queryClient.setQueryData<NextTaskResponse>(["next-task"], {
          task: result.nextTask,
          pendingCount: result.pendingCount,
        });
      },
    },
  );

  const handleComplete = async () => {
    if (!data?.task || mutation.isPending || deferMutation.isPending) {
      return;
    }
    await mutation.mutateAsync(data.task.id);
  };

  const handleDefer = async () => {
    if (!data?.task || mutation.isPending || deferMutation.isPending) {
      return;
    }
    await deferMutation.mutateAsync(data.task.id);
  };

  return (
    <View className="flex-1 bg-[#071333]">
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#071333", "#244b99"]} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 p-6 justify-center">
              <Text className="text-white/80 text-lg mb-2">Dein nächster Mikro-Schritt</Text>
              {isLoading || isRefetching ? (
                <ActivityIndicator color="#ffffff" />
              ) : data?.task ? (
                <TaskCard task={data.task} />
              ) : (
                <View className="bg-white/5 rounded-3xl p-8 items-center">
                  <Text className="text-4xl mb-4">🌟</Text>
                  <Text className="text-white text-xl font-semibold text-center">
                    Alles erledigt! Zeit für eine Pause.
                  </Text>
                  <TouchableOpacity onPress={() => refetch()} className="mt-6 bg-white/10 px-4 py-2 rounded-full">
                    <Text className="text-white">Aktualisieren</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View className="mt-8">
                <Text className="text-white/80 text-sm mb-3">
                  {data?.pendingCount ? `${data.pendingCount - (data.task ? 1 : 0)} weitere Schritte warten auf dich.` : ""}
                </Text>
                <TouchableOpacity
                  onPress={handleComplete}
                  disabled={!data?.task || mutation.isPending || deferMutation.isPending}
                  className="bg-white py-4 rounded-2xl items-center"
                >
                  {mutation.isPending || deferMutation.isPending ? (
                    <ActivityIndicator color="#244b99" />
                  ) : (
                    <Text className="text-[#071333] text-base font-semibold">Aufgabe abhaken ✅</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDefer}
                  disabled={!data?.task || mutation.isPending || deferMutation.isPending}
                  className="mt-3 py-3 items-center rounded-2xl border border-white/30"
                >
                  <Text className="text-white/90">Heute überspringen ⏭️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => refetch()}
                  disabled={isRefetching || mutation.isPending || deferMutation.isPending}
                  className="mt-4 py-3 items-center rounded-2xl border border-white/20"
                >
                  <Text className="text-white">Andere Aufgabe anzeigen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
      <CelebrationOverlay visible={isCelebrating} />
    </View>
  );
};
