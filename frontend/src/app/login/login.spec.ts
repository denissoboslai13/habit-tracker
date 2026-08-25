import { TestBed } from '@angular/core/testing';
import { Login } from './login'
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('Login form validation', () => {
  let component: Login;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, ToastrModule.forRoot()],
      providers: [ToastrService, provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  it('is invalid when email is empty', () => {
    component.profileForm.patchValue({ email: '', password_hash: 'somepassword' });
    expect(component.profileForm.valid).toBe(false);
  });

  it('is invalid when email is not a valid email format', () => {
    component.profileForm.patchValue({ email: 'notanemail', password_hash: 'somepassword' });
    expect(component.profileForm.get('email')?.hasError('email')).toBe(true);
  });

  it('is valid with a proper email and password', () => {
    component.profileForm.patchValue({ email: 'test@example.com', password_hash: 'somepassword' });
    expect(component.profileForm.valid).toBe(true);
  });

  it('requires a password', () => {
    component.profileForm.patchValue({ email: 'test@example.com', password_hash: '' });
    expect(component.profileForm.get('password_hash')?.hasError('required')).toBe(true);
  });
});