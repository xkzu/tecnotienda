import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
})
export class UpdateUserComponent implements OnInit {
  user: User = { id: 0, nombre: '', email: '', password: '', admin: false };

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userStateService.getCurrentUser();
    if (currentUser) {
      // Carga los datos del usuario desde el estado
      this.user = { ...currentUser };
    } else {
      alert('Usuario no encontrado');
      this.router.navigate(['/login']); // Redirige si no hay usuario en sesión
    }
  }

  onSubmit(): void {
    this.userStateService.updateUser(this.user).subscribe({
      next: () => {
        alert('Usuario actualizado exitosamente');
        this.router.navigate(['/home']); // O redirige a donde prefieras
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al actualizar el usuario');
      },
    });
  }
}
