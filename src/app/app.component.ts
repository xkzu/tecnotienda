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

  constructor(private router: Router, private userStateService: UserStateService) {}

  ngOnInit(): void {
    // Verificar si hay un usuario actual en localStorage y actualizar el estado
    const savedUser = this.userStateService.getCurrentUser();
    if (savedUser) {
      this.currentUser = savedUser;
    }

    // Suscribirse al observable currentUser$ para actualizar currentUser cuando cambie el estado del usuario
    this.userStateService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    // Llamar a clearCurrentUser del UserStateService para cerrar la sesión
    this.userStateService.clearCurrentUser();
    this.router.navigate(['/login']);
  }
}
