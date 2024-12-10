import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { Product } from '../models/product';
import { VentaService } from '../services/venta.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  totalAmount: number = 0;
  isPaymentFormVisible: boolean = false;

  constructor(
    private router: Router,
    private userStateService: UserStateService,
    private ventaService: VentaService
  ) {}

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
    const existingProduct = this.cartItems.find(cartItem => cartItem.nombre === product.nombre);

    if (existingProduct) {
      existingProduct.quantity! += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }

    this.saveCart();
    this.calculateTotal();
  }

  removeFromCart(product: Product): void {
    const productIndex = this.cartItems.findIndex(cartItem => cartItem.nombre === product.nombre);

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
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.precio * (item.quantity || 1)), 0);
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

  handlePayment(paymentDetails: { cardNumber: string; cardName: string; cvv: string }): void {
    const currentUser = this.userStateService.getCurrentUser();
    if (!currentUser) {
      alert('Debes iniciar sesión para realizar la compra.');
      this.router.navigate(['/login']);
      return;
    }

    const venta = {
      usuarioId: currentUser.id,
      productos: JSON.stringify(this.cartItems.map(item => ({
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.quantity
      }))),
      total: this.totalAmount
    };

    this.ventaService.addVenta(venta).subscribe({
      next: () => {
        alert('Venta realizada con éxito.');
        this.clearCart();
        this.isPaymentFormVisible = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al realizar la venta:', err);
        alert('Ocurrió un error al procesar la venta. Por favor, inténtalo de nuevo.');
      }
    });
  }

  getProductQuantity(product: Product): number {
    const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = cart.find(cartItem => cartItem.id === product.id);
    return existingProduct ? existingProduct.quantity! : 0;
  }

  checkout(): void {
    this.showPaymentForm();
  }
}
