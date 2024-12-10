import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { UserStateService } from './services/user-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ps-factory';
  currentUser: User | null = null;
  isAdmin: boolean = false;

  constructor(private router: Router, private userStateService: UserStateService) {}

  ngOnInit(): void {
    // Verificar si hay un usuario actual en localStorage y actualizar el estado
    const savedUser = this.userStateService.getCurrentUser();
    if (savedUser) {
      this.updateUserState(savedUser);
    }

    // Suscribirse al observable currentUser$ para actualizar currentUser cuando cambie el estado del usuario
    this.userStateService.currentUser$.subscribe(user => {
      if (user) {
        this.updateUserState(user);
      } else {
        this.clearUserState();
      }
    });
  }

  // Actualiza el estado del usuario actual
  private updateUserState(user: User): void {
    this.currentUser = user;
    this.isAdmin = !!user.admin; // Convertimos a boolean en caso de ser undefined
  }

  // Limpia el estado del usuario actual
  private clearUserState(): void {
    this.currentUser = null;
    this.isAdmin = false;
  }

  logout(): void {
    // Llamar a clearCurrentUser del UserStateService para cerrar la sesión
    this.userStateService.clearCurrentUser();
    this.clearUserState();
    this.router.navigate(['/login']);
  }

  // Método para manejar la redirección si no hay un usuario actual
  getCurrentUserId(): number {
    if (this.currentUser) {
      return this.currentUser.id;
    }
    alert('ID de usuario inválido');
    this.router.navigate(['/login']);
    return 0; // Valor por defecto para evitar errores
  }
}
