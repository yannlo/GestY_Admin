import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import Icon from "../Icon";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const MONTHS_SHORT = [
  "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sept", "Oct", "Nov", "Déc",
];

// Week starts on Monday
const WEEK_DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

type CalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
};

type ViewMode = "days" | "months" | "years";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildDayMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Convert Sunday=0..Saturday=6 to Monday=0..Sunday=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export function Calendar({ value, onChange }: CalendarProps) {
  const today = new Date();
  const initial = value ?? today;
  const [viewMode, setViewMode] = useState<ViewMode>("days");
  const [displayYear, setDisplayYear] = useState(initial.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(initial.getMonth());

  const goPrev = () => {
    if (viewMode === "days") {
      if (displayMonth === 0) {
        setDisplayMonth(11);
        setDisplayYear((y) => y - 1);
      } else {
        setDisplayMonth((m) => m - 1);
      }
    } else if (viewMode === "years") {
      setDisplayYear((y) => y - 12);
    }
  };

  const goNext = () => {
    if (viewMode === "days") {
      if (displayMonth === 11) {
        setDisplayMonth(0);
        setDisplayYear((y) => y + 1);
      } else {
        setDisplayMonth((m) => m + 1);
      }
    } else if (viewMode === "years") {
      setDisplayYear((y) => y + 12);
    }
  };

  const headerLabel =
    viewMode === "days"
      ? `${MONTHS[displayMonth]} ${displayYear}`
      : viewMode === "months"
        ? `${displayYear}`
        : `${displayYear - 6} - ${displayYear + 5}`;

  const cycleView = () => {
    setViewMode((mode) => (mode === "days" ? "months" : mode === "months" ? "years" : "days"));
  };

  return (
    <View className="gap-3">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Pressable onPress={goPrev} className="size-9 items-center justify-center rounded-md active:bg-gy-gray-100">
          <Icon name="chevron-left" className="text-gy-gray-600 size-6" />
        </Pressable>
        <Pressable onPress={cycleView} className="px-3 py-1.5 rounded-md active:bg-gy-gray-100">
          <Text className="font-baloo-semibold text-base text-gy-black">{headerLabel}</Text>
        </Pressable>
        <Pressable onPress={goNext} className="size-9 items-center justify-center rounded-md active:bg-gy-gray-100">
          <Icon name="chevron-right" className="text-gy-gray-600 size-6" />
        </Pressable>
      </View>

      {viewMode === "days" && (
        <View className="gap-1">
          {/* Week day labels */}
          <View className="flex-row">
            {WEEK_DAYS.map((d) => (
              <View key={d} className="flex-1 items-center py-1">
                <Text className="font-baloo-medium text-xs text-gy-gray-500">{d}</Text>
              </View>
            ))}
          </View>
          {/* Day grid */}
          {buildDayMatrix(displayYear, displayMonth).map((row, ri) => (
            <View key={ri} className="flex-row">
              {row.map((cell, ci) => {
                if (!cell) return <View key={ci} className="flex-1 aspect-square" />;
                const selected = value && isSameDay(cell, value);
                const isToday = isSameDay(cell, today);
                return (
                  <View key={ci} className="flex-1 aspect-square p-0.5">
                    <Pressable
                      onPress={() => onChange?.(cell)}
                      className={`flex-1 items-center justify-center rounded-md ${
                        selected ? "bg-gy-primary-500" : isToday ? "bg-gy-primary-100" : "active:bg-gy-gray-100"
                      }`}
                    >
                      <Text
                        className={`font-baloo text-base ${
                          selected ? "text-gy-white" : isToday ? "text-gy-primary-500" : "text-gy-black"
                        }`}
                      >
                        {cell.getDate()}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}

      {viewMode === "months" && (
        <View className="flex-row flex-wrap">
          {MONTHS_SHORT.map((label, index) => {
            const selected = value && value.getMonth() === index && value.getFullYear() === displayYear;
            const isCurrent = today.getMonth() === index && today.getFullYear() === displayYear;
            return (
              <View key={label} className="w-1/3 p-1">
                <Pressable
                  onPress={() => {
                    setDisplayMonth(index);
                    setViewMode("days");
                  }}
                  className={`py-3 items-center justify-center rounded-md ${
                    selected ? "bg-gy-primary-500" : isCurrent ? "bg-gy-primary-100" : "active:bg-gy-gray-100"
                  }`}
                >
                  <Text
                    className={`font-baloo text-base ${
                      selected ? "text-gy-white" : isCurrent ? "text-gy-primary-500" : "text-gy-black"
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {viewMode === "years" && (
        <View className="flex-row flex-wrap">
          {Array.from({ length: 12 }, (_, i) => displayYear - 6 + i).map((year) => {
            const selected = value && value.getFullYear() === year;
            const isCurrent = today.getFullYear() === year;
            return (
              <View key={year} className="w-1/3 p-1">
                <Pressable
                  onPress={() => {
                    setDisplayYear(year);
                    setViewMode("months");
                  }}
                  className={`py-3 items-center justify-center rounded-md ${
                    selected ? "bg-gy-primary-500" : isCurrent ? "bg-gy-primary-100" : "active:bg-gy-gray-100"
                  }`}
                >
                  <Text
                    className={`font-baloo text-base ${
                      selected ? "text-gy-white" : isCurrent ? "text-gy-primary-500" : "text-gy-black"
                    }`}
                  >
                    {year}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default Calendar;
