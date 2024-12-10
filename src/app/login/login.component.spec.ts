import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';

class MockRouter {
  navigate(path: string[]) {
    return path;
  }
}

class MockUserStateService {
  login(email: string, password: string) {
    if (email === 'valid@example.com' && password === 'password') {
      return of({ id: 1, nombre: 'Test User', email, admin: false });
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  setCurrentUser(user: any) {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: MockRouter;
  let mockUserStateService: MockUserStateService;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockUserStateService = new MockUserStateService();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserStateService, useValue: mockUserStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on successful login', () => {
    const form = {
      valid: true,
      value: { email: 'valid@example.com', password: 'password' },
    } as NgForm;

    spyOn(mockRouter, 'navigate');
    spyOn(mockUserStateService, 'setCurrentUser');

    component.onSubmit(form);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    expect(mockUserStateService.setCurrentUser).toHaveBeenCalledWith({
      id: 1,
      nombre: 'Test User',
      email: 'valid@example.com',
      admin: false,
    });
    expect(component.loginError).toBeFalse();
  });

  it('should set loginError to true on failed login', () => {
    const form = {
      valid: true,
      value: { email: 'invalid@example.com', password: 'wrongpassword' },
    } as NgForm;

    spyOn(mockRouter, 'navigate');
    spyOn(mockUserStateService, 'setCurrentUser');

    component.onSubmit(form);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockUserStateService.setCurrentUser).not.toHaveBeenCalled();
    expect(component.loginError).toBeTrue();
  });

  it('should show alert when form is invalid', () => {
    const form = {
      valid: false,
      value: { email: '', password: '' },
    } as NgForm;

    spyOn(window, 'alert');

    component.onSubmit(form);

    expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente.');
  });
});
