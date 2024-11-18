import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  totalAmount: number = 0;
  isPaymentFormVisible: boolean = false;

  constructor(private router: Router, private userStateService: UserStateService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.calculateTotal();
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addToCart(product: Product): void {
    const existingProduct = this.cartItems.find(cartItem => cartItem.name === product.name);

    if (existingProduct) {
      existingProduct.quantity! += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }

    this.saveCart();
    this.calculateTotal();
  }

  removeFromCart(product: Product): void {
    const productIndex = this.cartItems.findIndex(cartItem => cartItem.name === product.name);

    if (productIndex > -1) {
      this.cartItems[productIndex].quantity! -= 1;
      if (this.cartItems[productIndex].quantity! <= 0) {
        this.cartItems.splice(productIndex, 1);
      }
      this.saveCart();
      this.calculateTotal();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity!), 0);
  }

  getTotalPrice(): number {
    return this.totalAmount;
  }

  showPaymentForm(): void {
    const currentUser = this.userStateService.getCurrentUser();
    if (!currentUser) {
      alert('Debes iniciar sesión para pagar.');
      this.router.navigate(['/login']);
      return;
    }
    this.isPaymentFormVisible = true;
  }

  handlePayment(paymentDetails: { cardNumber: string, cardName: string, cvv: string }): void {
    // Aquí podrías realizar la validación y procesamiento del pago real
    console.log('Pago recibido:', paymentDetails);
    alert('Pago realizado con éxito.');
    this.clearCart();
    this.isPaymentFormVisible = false;
    this.router.navigate(['/products']);
  }
}
