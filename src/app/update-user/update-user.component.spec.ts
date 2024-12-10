import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateUserComponent } from './update-user.component';
import { UserStateService } from '../services/user-state.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { User } from '../models/user.model';

class MockUserStateService {
  private currentUser: User = {
    id: 1,
    nombre: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    admin: false,
  };

  getCurrentUser() {
    return this.currentUser;
  }

  updateUser(user: User) {
    return of(user); // Simula una respuesta exitosa
  }
}

class MockRouter {
  navigate(path: string[]) {
    return path; // Simula la redirección
  }
}

describe('UpdateUserComponent', () => {
  let component: UpdateUserComponent;
  let fixture: ComponentFixture<UpdateUserComponent>;
  let mockUserStateService: MockUserStateService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockUserStateService = new MockUserStateService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      declarations: [UpdateUserComponent],
      imports: [FormsModule], // Se agregó FormsModule aquí
      providers: [
        { provide: UserStateService, useValue: mockUserStateService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the current user on initialization', () => {
    expect(component.user).toEqual(mockUserStateService.getCurrentUser());
  });

  it('should navigate to /login if no user is found', () => {
    spyOn(mockUserStateService, 'getCurrentUser').and.returnValue(null as unknown as User);
    spyOn(mockRouter, 'navigate');
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call updateUser and navigate to /home on form submission', () => {
    spyOn(mockUserStateService, 'updateUser').and.callThrough();
    spyOn(mockRouter, 'navigate');
    component.onSubmit();
    expect(mockUserStateService.updateUser).toHaveBeenCalledWith(component.user);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should display an alert if updateUser fails', () => {
    spyOn(mockUserStateService, 'updateUser').and.returnValue(
      throwError(() => new Error('Error al actualizar'))
    );
    spyOn(window, 'alert');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al actualizar el usuario');
  });
});
