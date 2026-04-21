import { WeekOverviewEntry } from "../types/api";
import { Text, View } from "react-native";

type WeeklyChartProps = {
  data: WeekOverviewEntry[];
};

const formatWeekday = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("de-DE", { weekday: "short" });
};

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const max = Math.max(...data.map((entry) => entry.count), 1);

  return (
    <View className="flex-row justify-between items-end mt-6">
      {data.map((entry) => {
        const height = (entry.count / max) * 120;
        return (
          <View key={entry.day} className="items-center flex-1">
            <View className="w-8 rounded-full overflow-hidden bg-white/10 h-32 justify-end">
              <View
                style={{ height }}
                className="w-full rounded-full bg-[#ff90e8]"
              />
            </View>
            <Text className="mt-2 text-white/80 text-xs uppercase tracking-wide">
              {formatWeekday(entry.day)}
            </Text>
            <Text className="text-white text-sm font-semibold">{entry.count}</Text>
          </View>
        );
      })}
    </View>
  );
};
