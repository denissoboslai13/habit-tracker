import { Component, effect, inject, input, signal } from '@angular/core';
import { LogService } from '../services/log-service/log-service';
import { indLog } from '../models/log.type';
import { Header } from '../header/header';
import { AddLog } from '../components/add-log/add-log';

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
    });
  }

  onLogAdded(newLog: indLog) {
    this.habitLogs.update(current => [...current, newLog]);
  }
}
