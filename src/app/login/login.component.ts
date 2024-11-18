import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginError: boolean = false;

  constructor(private router: Router, private userStateService: UserStateService) {}

  onSubmit(form: NgForm): void {
    // Reiniciar loginError al intentar un nuevo envío
    this.loginError = false;

    if (form.valid) {
      const nombre = form.value.nombre;
      const password = form.value.password;

      // Autenticar usuario con los usuarios registrados
      const authenticatedUser = this.userStateService.authenticateUser(nombre, password);

      if (authenticatedUser) {
        // Establecer el usuario autenticado como el usuario actual
        this.userStateService.setCurrentUser(authenticatedUser);
        // Redirigir al home o página de inicio
        this.router.navigate(['/home']);
      } else {
        // Muestra un mensaje de error si las credenciales no son válidas
        this.loginError = true;
      }
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }
}
