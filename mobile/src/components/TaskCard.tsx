import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Text, View } from "react-native";
import { TaskDto } from "../types/api";

type TaskCardProps = {
  task: TaskDto;
};

export const TaskCard = memo(({ task }: TaskCardProps) => {
  const room = task.group.item.room;
  const item = task.group.item;

  return (
    <LinearGradient
      colors={["rgba(70,133,255,0.9)", "rgba(255,144,232,0.85)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl p-6 shadow-2xl"
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-xl font-semibold">{room.emoji ?? "✨"} {room.name}</Text>
        <View className="rounded-full bg-white/20 px-3 py-1">
          <Text className="text-white text-xs uppercase tracking-wide">Schritt {task.sequence}</Text>
        </View>
      </View>
      <View className="mb-3">
        <Text className="text-white/80 text-sm">Bereich</Text>
        <Text className="text-white text-lg font-medium">{item.icon ?? "📦"} {item.name}</Text>
      </View>
      <View className="space-y-2">
        <Text className="text-white/80 text-sm">Aufgabe</Text>
        <Text className="text-white text-2xl font-bold leading-tight">{task.description}</Text>
        <Text className="text-white/80 text-sm">
          ⏱️ {task.expectedDurationMinutes} Minuten · +{task.rewardPoints} XP
        </Text>
      </View>
    </LinearGradient>
  );
});

TaskCard.displayName = "TaskCard";
