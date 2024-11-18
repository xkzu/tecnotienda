import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserStateService } from '../services/user-state.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  nombre: string = '';
  password: string = '';
  confirmPassword: string = '';
  admin: boolean = false; // Por defecto el usuario no es admin
  emailInvalid: boolean = false;
  passwordInvalid: boolean = false;
  passwordsDoNotMatch: boolean = false;

  constructor(private router: Router, private userStateService: UserStateService) {}

  validateEmail(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = !emailPattern.test(this.email);
  }

  validatePassword(): void {
    this.passwordInvalid = this.password.length < 8;
    this.passwordsDoNotMatch = this.password !== this.confirmPassword;
  }

  onSubmit(registerForm: NgForm): void {
    if (registerForm.valid && !this.emailInvalid && !this.passwordInvalid && !this.passwordsDoNotMatch) {
      const newUser: User = {
        id: 0, // El ID se asignará automáticamente al registrarse
        nombre: this.nombre,
        password: this.password,
        email: this.email,
        admin: this.admin // Por defecto es false
      };

      // Registrar el usuario
      this.userStateService.registerUser(newUser);

      // Establecer el usuario registrado como el usuario actual
      this.userStateService.setCurrentUser(newUser);

      // Redirigir al usuario a la página de inicio
      this.router.navigate(['/home']);
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }
}
