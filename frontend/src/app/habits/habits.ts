import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { catchError } from 'rxjs';
import { Item } from '../models/item.type';
import { AddHabit } from '../components/add-habit/add-habit';
import { HabitService } from '../services/habit-service/habit-service';
import { Header } from '../header/header';
import { Router } from '@angular/router';
import { Habit } from '../models/habit.type';
import { ToastrService } from 'ngx-toastr';
import { LucideX, LucideWrench, LucideEye } from '@lucide/angular'
import { UpdateHabit } from '../components/update-habit/update-habit';
import { NewHabit } from '../models/newHabit.type';
import { Daily, DailyStreak } from '../models/daily.type';
import { calcDaily } from '../helpers/calcDaily';

@Component({
  selector: 'app-habits',
  imports: [AddHabit, Header, LucideWrench, LucideX, LucideEye, UpdateHabit],
  templateUrl: './habits.html',
  styles: ``,
})
export class Habits implements OnInit {
  habitService = inject(HabitService)
  habits = signal<Array<Habit>>([])  
  private router = inject(Router);
  toastr = inject(ToastrService);
  editingHabitId = signal<string | null>(null);
  daily = signal<DailyStreak | null>(null);

  ngOnInit(): void {
    this.habitService
    .getHabits()
    .pipe(
      catchError((err) => {
        this.toastr.success(`Habit couldn't be deleted!`, 'Error');
        throw err;
      })
    )
    .subscribe((items) => {
      if (!items.length) {
        this.habits.set([])
      } else {
        this.habits.set(items);
      }
    })
    this.habitService
    .getDaily().subscribe({
      next: (dailyStreak: any) => {
        console.log(dailyStreak)
        console.log(calcDaily(dailyStreak))
        const today = calcDaily(dailyStreak)
        this.daily.set(today)
      },
      error: () => {

      }
    })
  }

  isComplete = computed(() => Number(this.daily()?.percentage) >= 100);

  onHabitAdded(newHabit: Habit) {
    this.habits.update(current => [...current, newHabit]);
  }

  onHabitUpdated(updatedHabit: Habit) {
    console.log(updatedHabit)
    this.habits.update(current => current.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
  }

  onDelete(habit: Habit){
    console.log(habit)
    this.habitService
    .deleteHabit(habit)
    .subscribe({
      next: () => {
        this.habits.update(current => current.filter(p => p.id != habit.id));
        this.toastr.success(`Habit ${habit.name} deleted!`, 'Success');
      },
      error: () => {
        this.toastr.success(`Habit couldn't be deleted!`, 'Error');
      }
    })
    
  }

  detailClick(habit: Habit) {
    this.router.navigate([`/habits/${habit.id}`])
  }

  startEdit(habit: Habit) {
    this.editingHabitId.set(habit.id);
    if (this.editingHabitId()) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  cancelEdit() {
    this.editingHabitId.set(null);
    document.body.style.overflow = ''
  }
}
