import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styles: ``,
})

export class LoginForm {
  
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
