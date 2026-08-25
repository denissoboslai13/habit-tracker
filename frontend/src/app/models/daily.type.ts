import { Habit } from "./habit.type";
import { indLog } from "./log.type";

export type DailyStreak = {
    total: number,
    completed: number,
    percentage: string
}

export type Daily = {
  habits: Habit[];
  logs: indLog[];
};