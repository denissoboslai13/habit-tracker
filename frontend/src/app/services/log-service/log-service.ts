import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { indLog, Log } from '../../models/log.type';
import { UserService } from '../user-service/user-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  http = inject(HttpClient)
  userService = inject(UserService)
  getInterval(id: string) {
    const url = `${environment.apiUrl}/api/habits/${id}/logs`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.get<Log>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  postLog(id: string, log: indLog) {
    const url = `${environment.apiUrl}/api/habits/${id}/logs`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.post(url, log, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  getLongest(id: string) {
    const url = `${environment.apiUrl}/api/habits/${id}/stats`
    const csrfToken = this.userService.getCsrfToken();
    console.log(csrfToken)
    return this.http.get<Array<indLog>>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
}
