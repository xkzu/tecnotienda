import { TestBed } from '@angular/core/testing';
import { UserStateService } from './user-state.service';

describe('UserStateService', () => {
  let service: UserStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get current user', () => {
    const user = { username: 'test', email: 'test@example.com', role: 'user' };
    service.setCurrentUser(user);
    expect(service.getCurrentUser()).toEqual(user);
  });

  it('should clear current user', () => {
    const user = { username: 'test', email: 'test@example.com', role: 'user' };
    service.setCurrentUser(user);
    service.clearCurrentUser();
    expect(service.getCurrentUser()).toBeNull();
  });
});
