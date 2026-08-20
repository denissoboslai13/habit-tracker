import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegCreds } from '../../models/regCreds.type';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient)
  handleRegister(regCreds: RegCreds) {
    const url = `http://127.0.0.1:4141/api/register`
    return this.http.post(url, regCreds)
  }
  handleLogin(logCreds: RegCreds) {
    const url = `http://127.0.0.1:4141/api/login`
    return this.http.post(url, logCreds, { withCredentials: true })
  }
  handleLogout(){
    const url = `http://127.0.0.1:4141/api/logout`
    return this.http.post(url, {}, { withCredentials: true })
  }
}
