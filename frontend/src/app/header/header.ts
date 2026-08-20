import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service/user-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  userService = inject(UserService)
  private router = inject(Router);

  onLogout() {
    this.userService
    .handleLogout()
    .subscribe({
      next: () => this.router.navigate(['/']),
    });
  }

  homeClick() {
    this.router.navigate(['/habits'])
  }
}
