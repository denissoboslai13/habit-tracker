import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Habit } from '../../models/habit.type';
import { getCookie } from '../../helpers/getCookies';
import { Item } from '../../models/item.type';
import { NewHabit } from '../../models/newHabit.type';
import { Updatedhabit } from '../../models/updatedHabit.type';
import { Daily } from '../../models/daily.type';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  http = inject(HttpClient)
  getHabits() {
    const url = `https://habit-tracker-backend-mdg4.onrender.com/api/habits`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.get<Array<Habit>>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  getDaily() {
    const url = `https://habit-tracker-backend-mdg4.onrender.com/api/habits/daily`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.get<Daily>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  postHabit(habit: NewHabit) {
    const url = `https://habit-tracker-backend-mdg4.onrender.com/api/habits`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.post(url, habit, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  updateHabit(id: string, habit: Updatedhabit) {
    const url = `https://habit-tracker-backend-mdg4.onrender.com/api/habits/${id}`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.put(url, habit, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  deleteHabit(habit: Habit) {
    const url = `https://habit-tracker-backend-mdg4.onrender.com/api/habits/${habit.id}`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.delete(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
}
