import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service/user-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  userService = inject(UserService)
  private router = inject(Router);
  toastr = inject(ToastrService);

  onLogout() {
    this.userService
    .handleLogout()
    .subscribe({
      next: () => {
        this.router.navigate(['/'])
        this.toastr.success(`Successfully logged out!`, 'Success');
      },
      error: () => {
        this.toastr.error(`Couldnt log out!`, 'Error');
      }
    });
  }

  homeClick() {
    this.router.navigate(['/habits'])
  }
}
