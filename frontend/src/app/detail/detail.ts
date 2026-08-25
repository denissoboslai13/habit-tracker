import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LogService } from '../services/log-service/log-service';
import { indLog } from '../models/log.type';
import { Header } from '../header/header';
import { AddLog } from '../components/add-log/add-log';
import { dateKey } from '../helpers/dateKey';

@Component({
  selector: 'app-detail',
  imports: [Header, AddLog],
  templateUrl: './detail.html',
  styles: ``,
})
export class Detail {
  id = input.required<string>();
  logService = inject(LogService)
  habitName = signal<string>('');
  habitColor = signal<string>('');
  habitLogs = signal<Array<indLog>>([]);
  longestStreak = signal<Array<indLog>>([]);

  constructor() {
    effect(() => {
      console.log('Habit id from route:', this.id());
      this.logService
      .getInterval(this.id())
      .subscribe(res => {
        console.log(res)
        this.habitName.set(res.habit.name)
        this.habitColor.set(res.habit.color)
        this.habitLogs.set(res.logs)
      })
      this.logService
      .getLongest(this.id())
      .subscribe(res => {
        console.log(res)
        this.longestStreak.set(res)
      })
    });
  }

  onLogAdded(newLog: indLog) {
    this.habitLogs.update(current => [...current, newLog]);
  }

  onTrueAdded(newLog: indLog) {
    this.longestStreak.update(current => [...current, newLog]);
  }

  currentMonth = signal(new Date());

  onMonthAfter() {
    const date = this.currentMonth();
    this.currentMonth.set(new Date(date.getFullYear(), date.getMonth() + 1))
  }

  onMonthBefore() {
    const date = this.currentMonth();
    this.currentMonth.set(new Date(date.getFullYear(), date.getMonth() - 1))
  }
  calendarDays = computed(() => {
    const date = this.currentMonth();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startPadding = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  });

  logsByDate = computed(() => {
    const map = new Map<string, boolean>();
    for (const log of this.habitLogs()) {
      const dateKey = new Date(log.date).toISOString().split('T')[0];
      map.set(dateKey, log.completed);
    }
    return map;
  });

  

  isCompleted(day: Date): boolean {
    return this.logsByDate().get(dateKey(day)) === true;
  }
}
