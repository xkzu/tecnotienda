import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginError: boolean = false;

  constructor(private router: Router, private userStateService: UserStateService) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const email = form.value.email;
      const password = form.value.password;

      // Loguear el JSON que se enviará al backend
      const requestBody = { email, password };
      console.log('Enviando JSON al endpoint:', requestBody);

      // Realizar la solicitud al endpoint de login
      this.userStateService.login(email, password).subscribe({
        next: (user) => {
          console.log('Respuesta del servidor:', user); // Loguear la respuesta exitosa
          this.userStateService.setCurrentUser(user);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error en login:', err); // Loguear el error si ocurre
          this.loginError = true;
        },
      });
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }
}
