import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient)
  checkAuth() {
    return this.http.get('http://127.0.0.1:4141/api/me', { withCredentials: true });
  }
}
