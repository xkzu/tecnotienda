import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeDefaultUser();
    this.initializeCurrentUser();
  }

  // Inicializar el usuario actual desde localStorage
  private initializeCurrentUser(): void {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        this.currentUserSubject.next(parsedUser);
      }
    } catch (error) {
      console.error('Error al cargar el usuario actual desde localStorage:', error);
    }
  }

  // Inicializar el usuario por defecto (Beto)
  private initializeDefaultUser(): void {
    try {
      const users = this.loadRegisteredUsers();
      if (!users.find(user => user.nombre === 'beto')) {
        const defaultUser: User = {
          id: 1,
          nombre: 'beto',
          password: '1234',
          email: 'beto@example.com',
          admin: false
        };
        users.push(defaultUser);
        this.saveRegisteredUsers(users);
      }
    } catch (error) {
      console.error('Error al inicializar el usuario por defecto:', error);
    }
  }

  // Cargar usuarios registrados desde localStorage
  private loadRegisteredUsers(): User[] {
    try {
      return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch (error) {
      console.error('Error al cargar los usuarios registrados:', error);
      return [];
    }
  }

  // Guardar usuarios registrados en localStorage
  private saveRegisteredUsers(users: User[]): void {
    try {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    } catch (error) {
      console.error('Error al guardar los usuarios registrados:', error);
    }
  }

  // Registrar un nuevo usuario
  registerUser(user: User): void {
    try {
      const users = this.loadRegisteredUsers();
      user.id = users.length + 1; // Asignar un ID único
      users.push(user);
      this.saveRegisteredUsers(users);
    } catch (error) {
      console.error('Error al registrar un nuevo usuario:', error);
    }
  }

  // Iniciar sesión de un usuario
  setCurrentUser(user: User): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error al establecer el usuario actual:', error);
    }
  }

  // Cerrar sesión
  clearCurrentUser(): void {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Error al cerrar sesión del usuario:', error);
    }
  }

  // Verificar si el usuario está registrado
  authenticateUser(nombre: string, password: string): User | null {
    try {
      const users = this.loadRegisteredUsers();
      return users.find(user => user.nombre === nombre && user.password === password) || null;
    } catch (error) {
      console.error('Error al autenticar al usuario:', error);
      return null;
    }
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar si el usuario está autenticado
  isUserLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
