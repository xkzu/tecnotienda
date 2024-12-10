import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

class MockUserStateService {
  registerUser(user: any) {
    return of(user);
  }

  setCurrentUser(user: any) {}
}

class MockRouter {
  navigate(path: string[]) {
    return path;
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userStateService: MockUserStateService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule],
      providers: [
        { provide: UserStateService, useClass: MockUserStateService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userStateService = TestBed.inject(UserStateService) as unknown as MockUserStateService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email format', () => {
    component.email = 'invalid-email';
    component.validateEmail();
    expect(component.emailInvalid).toBeTrue();

    component.email = 'valid.email@example.com';
    component.validateEmail();
    expect(component.emailInvalid).toBeFalse();
  });

  it('should validate password length and match', () => {
    component.password = 'short';
    component.confirmPassword = 'short';
    component.validatePassword();
    expect(component.passwordInvalid).toBeTrue();
    expect(component.passwordsDoNotMatch).toBeFalse();

    component.password = 'validpassword';
    component.confirmPassword = 'differentpassword';
    component.validatePassword();
    expect(component.passwordInvalid).toBeFalse();
    expect(component.passwordsDoNotMatch).toBeTrue();

    component.confirmPassword = 'validpassword';
    component.validatePassword();
    expect(component.passwordInvalid).toBeFalse();
    expect(component.passwordsDoNotMatch).toBeFalse();
  });

  it('should register a new user successfully', () => {
    const newUser = {
      id: 0,
      nombre: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      admin: false,
    };

    const form = {
      valid: true,
      value: {},
    } as NgForm;

    spyOn(userStateService, 'registerUser').and.callThrough();
    spyOn(userStateService, 'setCurrentUser');
    spyOn(router, 'navigate');

    component.nombre = newUser.nombre;
    component.email = newUser.email;
    component.password = newUser.password;
    component.confirmPassword = newUser.password;
    component.admin = newUser.admin;

    component.onSubmit(form);

    expect(userStateService.registerUser).toHaveBeenCalledWith(newUser);
    expect(userStateService.setCurrentUser).toHaveBeenCalledWith(newUser);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show an error when registration fails', () => {
    spyOn(userStateService, 'registerUser').and.returnValue(throwError(() => new Error('Registration error')));
    spyOn(window, 'alert');

    const form = {
      valid: true,
      value: {},
    } as NgForm;

    component.onSubmit(form);

    expect(window.alert).toHaveBeenCalledWith('Error al registrar el usuario.');
  });

  it('should show an alert when form is invalid', () => {
    spyOn(window, 'alert');

    const form = {
      valid: false,
      value: {},
    } as NgForm;

    component.onSubmit(form);

    expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente.');
  });
});
