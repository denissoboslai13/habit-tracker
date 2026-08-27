import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserService } from '../user-service/user-service';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  userService = inject(UserService);

  checkAuth() {
    return this.http.get<{ user_id: string; csrf_token: string }>(`${environment.apiUrl}/api/me`, { withCredentials: true })
      .pipe(
        tap(res => this.userService.setCsrfToken(res.csrf_token))
      );
  }
}
