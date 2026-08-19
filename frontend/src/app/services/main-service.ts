import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Item } from '../models/item.type';
import { Habit } from '../models/habit.type';

function getCookie(name: string): string | null {
  console.log("name: ", name)
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

@Injectable({
  providedIn: 'root',
})
export class MainService {
  http = inject(HttpClient)
  getUsersFromApi() {
    const url = `http://127.0.0.1:4141/`
    return this.http.get<Array<Item>>(url)
  }
  getHabitsFromApi() {
    const url = `http://127.0.0.1:4141/api/habits`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.get<Array<Habit>>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
    
  }
