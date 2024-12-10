import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserStateService } from '../services/user-state.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  nombre: string = '';
  password: string = '';
  confirmPassword: string = '';
  admin: boolean = false;

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

  async onSubmit(registerForm: NgForm): Promise<void> {
    if (registerForm.valid) {
      const newUser: User = {
        id: 0,
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        admin: this.admin,
      };

      this.userStateService.registerUser(newUser).subscribe({
        next: (user) => {
          this.userStateService.setCurrentUser(user);
          this.router.navigate(['/home']);
        },
        error: () => {
          alert('Error al registrar el usuario.');
        },
      });
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }

}
