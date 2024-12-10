import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { UserStateService } from './services/user-state.service';
import { User } from './models/user.model';

class MockUserStateService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockUserStateService: MockUserStateService;

  beforeEach(async () => {
    mockUserStateService = new MockUserStateService();

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule], // Incluimos RouterTestingModule
      providers: [
        { provide: UserStateService, useValue: mockUserStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update user state on init if user exists', () => {
    const user: User = { id: 1, nombre: 'Test User', email: 'test@example.com', password: '123456', admin: false };
    mockUserStateService.setCurrentUser(user);

    component.ngOnInit();

    expect(component.currentUser).toEqual(user);
    expect(component.isAdmin).toBe(false);
  });

  it('should clear user state when no user exists', () => {
    mockUserStateService.setCurrentUser(null); // Ahora acepta null sin errores
    component.ngOnInit();

    expect(component.currentUser).toBeNull();
    expect(component.isAdmin).toBe(false);
  });

  it('should navigate to login on logout', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.logout();

    expect(component.currentUser).toBeNull();
    expect(component.isAdmin).toBe(false);
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should return user ID if user exists', () => {
    const user: User = { id: 1, nombre: 'Test User', email: 'test@example.com', password: '123456', admin: false };
    mockUserStateService.setCurrentUser(user);

    const userId = component.getCurrentUserId();

    expect(userId).toBe(1);
  });

  it('should show alert and navigate to login if no user exists for getCurrentUserId', () => {
    spyOn(window, 'alert');
    const routerSpy = spyOn(component['router'], 'navigate');

    const userId = component.getCurrentUserId();

    expect(userId).toBe(0);
    expect(window.alert).toHaveBeenCalledWith('ID de usuario inválido');
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
});
