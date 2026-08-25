import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user-service/user-service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styles: ``,
})
export class Register {
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
    .handleRegister(this.profileForm.getRawValue())
    .subscribe({
      next: () => {
        this.router.navigate(['/login'])
        this.toastr.success(`Successfully registered, Please log in!`, 'Success');
      },
      error: (err) => {
        console.error('Login failed:', err)
        this.toastr.error(`Couldnt register, try again!`, 'Error');
      }
    })
  }
}
