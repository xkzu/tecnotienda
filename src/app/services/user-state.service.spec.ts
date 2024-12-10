import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserStateService } from './user-state.service';
import { User } from '../models/user.model';

describe('UserStateService', () => {
  let service: UserStateService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    nombre: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserStateService]
    });
    service = TestBed.inject(UserStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login and return user', () => {
    service.login('test@example.com', 'password123').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8095/usuarios/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
    req.flush(mockUser);
  });

  it('should register a new user', () => {
    service.registerUser(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8095/usuarios/agregar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should update an existing user', () => {
    service.updateUser(mockUser).subscribe(() => {
      expect().nothing(); // Expect no errors
    });

    const req = httpMock.expectOne(`http://localhost:8095/usuarios/actualizar/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    req.flush(null);
  });

  it('should set and get the current user', () => {
    service.setCurrentUser(mockUser);
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should clear the current user', () => {
    service.setCurrentUser(mockUser);
    service.clearCurrentUser();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should check if a user is logged in', () => {
    service.setCurrentUser(mockUser);
    expect(service.isLoggedIn()).toBeTrue();
    service.clearCurrentUser();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should fetch a user by ID', () => {
    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:8095/usuarios/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
