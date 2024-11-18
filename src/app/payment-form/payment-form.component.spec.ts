import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFormComponent } from './payment-form.component';
import { FormsModule } from '@angular/forms';

describe('PaymentFormComponent', () => {
  let component: PaymentFormComponent;
  let fixture: ComponentFixture<PaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentFormComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit payment details on submit', () => {
    spyOn(component.paymentSubmitted, 'emit');
    component.cardNumber = '1234567890123456';
    component.cardName = 'Test User';
    component.cvv = '123';
    component.submitPayment();
    expect(component.paymentSubmitted.emit).toHaveBeenCalledWith({
      cardNumber: '1234567890123456',
      cardName: 'Test User',
      cvv: '123'
    });
  });

  it('should emit modal closed event on close', () => {
    spyOn(component.modalClosed, 'emit');
    component.closeModal();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  });
});
