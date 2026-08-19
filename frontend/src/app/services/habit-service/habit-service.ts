import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Habit } from '../../models/habit.type';

function getCookie(name: string): string | null {
  console.log("name: ", name)
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  http = inject(HttpClient)
  postHabit(habit: Habit) {
      const url = `http://127.0.0.1:4141/api/habits`
      const csrfToken = getCookie('csrf_access_token');
      console.log(csrfToken)
      return this.http.post(url, habit, {
        withCredentials: true,
        headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
      });
    }
}
