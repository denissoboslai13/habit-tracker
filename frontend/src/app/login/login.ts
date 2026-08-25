import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service/user-service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  userService = inject(UserService)
  private router = inject(Router);
  toastr = inject(ToastrService);

  profileForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password_hash: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    console.log(this.profileForm.getRawValue())
    this.userService
    .handleLogin(this.profileForm.getRawValue())
    .subscribe({
      next: () => {
        this.router.navigate(['/habits'])
        this.toastr.success(`Successfully logged in!`, 'Success');
      },
      error: (err) => {
        console.error('Login failed:', err)
        this.toastr.error(`Couldn't log in, Try again!`, 'Error');
      }
    });
  }
}
