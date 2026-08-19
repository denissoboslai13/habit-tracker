import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
  styles: ``,
})
export class RegisterForm {

  userService = inject(UserService)

  profileForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password_hash: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    console.log(this.profileForm.getRawValue())
    this.userService
    .handleRegister(this.profileForm.getRawValue())
    .subscribe(res => {
      console.log(res)
    })
  }
}
