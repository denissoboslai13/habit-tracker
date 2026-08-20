import { Component, inject, OnInit, signal } from '@angular/core';
import { catchError } from 'rxjs';
import { Item } from '../models/item.type';
import { AddHabit } from '../components/add-habit/add-habit';
import { HabitService } from '../services/habit-service/habit-service';
import { Header } from '../header/header';
import { Router } from '@angular/router';
import { Habit } from '../models/habit.type';

@Component({
  selector: 'app-habits',
  imports: [AddHabit, Header],
  templateUrl: './habits.html',
  styles: ``,
})
export class Habits implements OnInit {
  habitService = inject(HabitService)
  habits = signal<Array<Habit>>([])  
  private router = inject(Router);

  ngOnInit(): void {
    this.habitService
    .getHabits()
    .pipe(
      catchError((err) => {
        console.log(err)
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
  }

  onHabitAdded(newHabit: Habit) {
    this.habits.update(current => [...current, newHabit]);
  }

  onDelete(habit: Habit){
    console.log(habit)
    this.habitService
    .deleteHabit(habit)
    .subscribe({
    })
    this.habits.update(current => current.filter(p => p.id != habit.id));
  }

  detailClick(habit: Habit) {
    this.router.navigate([`/habits/${habit.id}`])
  }
}
