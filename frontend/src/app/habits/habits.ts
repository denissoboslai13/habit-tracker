import { Component, inject, OnInit, signal } from '@angular/core';
import { MainService } from '../services/main-service';
import { catchError } from 'rxjs';
import { Habit } from '../models/habit.type';

@Component({
  selector: 'app-habits',
  imports: [],
  templateUrl: './habits.html',
  styles: ``,
})
export class Habits implements OnInit {
  mainService = inject(MainService)
  habits = signal<Array<Habit>>([])
  protected readonly title = signal('frontend');
  ngOnInit(): void {
    this.mainService
    .getHabitsFromApi()
    .pipe(
      catchError((err) => {
        console.log(err)
        throw err;
      })
    )
    .subscribe((items) => {
      this.habits.set(items);
    })
  }
}
