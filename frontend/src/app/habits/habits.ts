import { Component, inject, OnInit, signal } from '@angular/core';
import { MainService } from '../services/main-service';
import { catchError } from 'rxjs';
import { Item } from '../models/item.type';
import { AddHabit } from '../components/add-habit/add-habit';

@Component({
  selector: 'app-habits',
  imports: [AddHabit],
  templateUrl: './habits.html',
  styles: ``,
})
export class Habits implements OnInit {
  mainService = inject(MainService)
  habits = signal<Array<Item>>([])
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
