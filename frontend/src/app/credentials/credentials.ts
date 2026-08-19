import { Component } from '@angular/core';
import { RegisterForm } from '../components/register-form/register-form';
import { LoginForm } from '../components/login-form/login-form';

@Component({
  selector: 'app-credentials',
  imports: [RegisterForm, LoginForm],
  templateUrl: './credentials.html',
  styles: ``,
})
export class Credentials {}
