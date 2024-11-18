import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent {
  cardNumber: string = '';
  cardName: string = '';
  cvv: string = '';

  @Output() paymentSubmitted = new EventEmitter<{ cardNumber: string, cardName: string, cvv: string }>();
  @Output() modalClosed = new EventEmitter<void>();

  submitPayment(): void {
    if (this.cardNumber && this.cardName && this.cvv) {
      this.paymentSubmitted.emit({ cardNumber: this.cardNumber, cardName: this.cardName, cvv: this.cvv });
      this.closeModal();
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}
