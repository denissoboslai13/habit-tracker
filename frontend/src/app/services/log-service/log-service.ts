import { inject, Injectable } from '@angular/core';
import { getCookie } from '../../helpers/getCookies';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../models/item.type';
import { indLog, Log } from '../../models/log.type';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  http = inject(HttpClient)
  getInterval(id: string) {
    const url = `http://127.0.0.1:4141/api/habits/${id}/logs`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.get<Log>(url, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }
  postLog(id: string, log: indLog) {
    const url = `http://127.0.0.1:4141/api/habits/${id}/logs`
    const csrfToken = getCookie('csrf_access_token');
    console.log(csrfToken)
    return this.http.post(url, log, {
      withCredentials: true,
      headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}
    });
  }

}
