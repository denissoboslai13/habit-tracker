import { Component, inject, OnInit, signal } from '@angular/core';
import { Item } from '../models/item.type';
import { MainService } from '../services/main-service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styles: ``,
})

export class Home implements OnInit{
  mainService = inject(MainService)
  mainItems = signal<Array<Item>>([])
  protected readonly title = signal('frontend');
  ngOnInit(): void {
    this.mainService
    .getUsersFromApi()
    .pipe(
      catchError((err) => {
        console.log(err)
        throw err;
      })
    )
    .subscribe((items) => {
      this.mainItems.set(items);
    })
  }
}
