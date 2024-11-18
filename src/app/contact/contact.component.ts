import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  emailErrors: any = null;

  onEmailInput(form: NgForm): void {

    const emailControl = form.controls['email'];
    if (emailControl && emailControl.errors) {
      this.emailErrors = emailControl.errors;
    } else {
      this.emailErrors = null;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form Data: ', form.value);
      alert('Mensaje enviado con éxito.');
      form.reset();
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }
}
