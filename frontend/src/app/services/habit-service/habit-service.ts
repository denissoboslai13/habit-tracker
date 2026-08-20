import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Habit } from '../../models/habit.type';
import { getCookie } from '../../helpers/getCookies';
import { Item } from '../../models/item.type';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  http = inject(HttpClient)
  getHabits() {
    const url = `http://127.0.0.1:4141/api/habits`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.get<Array<Habit>>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  postHabit(habit: Habit) {
    const url = `http://127.0.0.1:4141/api/habits`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.post(url, habit, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  deleteHabit(habit: Habit) {
    const url = `http://127.0.0.1:4141/api/habits/${habit.id}`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.delete(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
}
