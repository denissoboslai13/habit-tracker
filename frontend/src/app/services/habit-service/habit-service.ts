import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Habit } from '../../models/habit.type';
import { NewHabit } from '../../models/newHabit.type';
import { Updatedhabit } from '../../models/updatedHabit.type';
import { Daily } from '../../models/daily.type';
import { UserService } from '../user-service/user-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  http = inject(HttpClient)
  userService = inject(UserService)
  getHabits() {
    const url = `${environment.apiUrl}/api/habits`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.get<Array<Habit>>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  getDaily() {
    const url = `${environment.apiUrl}/api/habits/daily`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.get<Daily>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  postHabit(habit: NewHabit) {
    const url = `${environment.apiUrl}/api/habits`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.post(url, habit, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  updateHabit(id: string, habit: Updatedhabit) {
    const url = `${environment.apiUrl}/api/habits/${id}`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.put(url, habit, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  deleteHabit(habit: Habit) {
    const url = `${environment.apiUrl}/api/habits/${habit.id}`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.delete(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
}
