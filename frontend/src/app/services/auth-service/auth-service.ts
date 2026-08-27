import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient)
  checkAuth() {
    return this.http.get('https://habit-tracker-backend-mdg4.onrender.com/api/me', { withCredentials: true });
  }
}
