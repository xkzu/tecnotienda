import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Product[] = [];

  addToCart(product: Product) {
    const item = this.items.find(p => p.nombre === product.nombre);
    if (item) {
      item.quantity = (item.quantity || 0) + 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
  }

  removeFromCart(product: Product) {
    const index = this.items.findIndex(p => p.nombre === product.nombre);
    if (index > -1) {
      const item = this.items[index];
      if (item.quantity && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.items.splice(index, 1);
      }
    }
  }

  clearCart() {
    this.items = [];
  }

  getItems() {
    return this.items;
  }
}
