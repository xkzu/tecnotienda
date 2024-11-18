import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCurrencyPipe } from '../pipes/custom-currency.pipe';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@NgModule({
  declarations: [
    CustomCurrencyPipe,
    PaymentFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CustomCurrencyPipe,
    PaymentFormComponent,
    FormsModule
  ]
})
export class SharedModule { }
