import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user-service/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styles: ``,
})
export class Register {
  userService = inject(UserService)
  private router = inject(Router);

  profileForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password_hash: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    console.log(this.profileForm.getRawValue())
    this.userService
    .handleRegister(this.profileForm.getRawValue())
    .subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Login failed:', err)
    })
  }
}
