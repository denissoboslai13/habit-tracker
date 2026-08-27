import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegCreds } from '../../models/regCreds.type';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient)

  handleRegister(regCreds: RegCreds) {
    const url = `${environment.apiUrl}/api/register`
    return this.http.post(url, regCreds)
  }
  handleLogout(){
    const url = `${environment.apiUrl}/api/logout`
    return this.http.post(url, {}, { withCredentials: true })
  }

  private csrfToken: string | null = null;

  getCsrfToken(): string | null {
    return this.csrfToken;
  }

  setCsrfToken(token: string) {
    this.csrfToken = token;
  }

  handleLogin(logCreds: RegCreds) {
    const url = `${environment.apiUrl}/api/login`;
    return this.http.post<{ csrf_token: string }>(url, logCreds, { withCredentials: true })
      .pipe(
        tap(res => this.setCsrfToken(res.csrf_token))
      );
  }
}
