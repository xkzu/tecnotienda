import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    {
      name: 'Tarjeta de video',
      marca: 'Gigabyte',
      description: '3 ventiladores, ideal para videojuegos.',
      price: 15000,
      image: 'assets/cards/card-1.png'
    },
    {
      name: 'Fuente de poder',
      marca: 'Corsair',
      description: 'Alto rendimiento.',
      price: 15000,
      image: 'assets/cards/card-2.png'
    },
    {
      name: 'Headset',
      marca: 'MSI',
      description: 'El mejor sonido.',
      price: 15000,
      image: 'assets/cards/card-3.png'
    },
    {
      name: 'Memoria Ram',
      marca: 'XPG',
      description: 'Set de dos memorias ram, 16GB.',
      price: 15000,
      image: 'assets/cards/card-4.png'
    },
    {
      name: 'Discipador',
      marca: 'DeepCool',
      description: 'De alta potencia.',
      price: 15000,
      image: 'assets/cards/card-5.png'
    },
    {
      name: 'Case',
      marca: 'Platinum',
      description: 'Nadie verá lo que hay por dentro, diseño austero.',
      price: 15000,
      image: 'assets/cards/card-8.png'
    },
    {
      name: 'Discipador',
      marca: 'Generic',
      description: 'Color blanco.',
      price: 15000,
      image: 'assets/cards/card-7.png'
    },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  addToCart(product: Product): void {
    let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = cart.find((cartItem: Product) => cartItem.name === product.name);

    if (existingProduct) {
      existingProduct.quantity! += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  removeFromCart(product: Product): void {
    let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex((cartItem: Product) => cartItem.name === product.name);

    if (productIndex > -1) {
      cart[productIndex].quantity! -= 1;
      if (cart[productIndex].quantity! <= 0) {
        cart.splice(productIndex, 1);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  getProductQuantity(product: Product): number {
    let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = cart.find((cartItem: Product) => cartItem.name === product.name);
    return existingProduct ? existingProduct.quantity! : 0;
  }

  checkout(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      alert('Debes iniciar sesión para comprar.');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/cart']);
    }
  }
}
