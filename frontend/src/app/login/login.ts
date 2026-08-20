import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service/user-service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  userService = inject(UserService)
  private router = inject(Router);

  profileForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password_hash: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    console.log(this.profileForm.getRawValue())
    this.userService
    .handleLogin(this.profileForm.getRawValue())
    .subscribe({
      next: () => this.router.navigate(['/habits']),
      error: (err) => console.error('Login failed:', err)
    });
  }
}
