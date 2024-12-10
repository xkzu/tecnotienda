import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html'
})
export class RecoveryPasswordComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  recoveryPassword(): void {
    const endpoint = `http://localhost:8095/usuarios/recuperar/password/${this.email}/${this.password}`;
    this.http.put(endpoint, {}).subscribe({
      next: () => {
        alert('La contraseña ha sido actualizada correctamente.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al actualizar la contraseña. Por favor, inténtalo nuevamente.');
      }
    });
  }
}
