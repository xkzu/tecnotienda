import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService,
              private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        console.log('Datos recibidos:', data); // Asegúrate de que `precio` sea válido
        this.products = data.map(product => ({
          id: product.id,
          nombre: product.nombre,
          marca: product.marca,
          descripcion: product.descripcion,
          precio: parseFloat(product.precio), // Convertimos `precio` a número
          imagen: product.imagen,
          quantity: 0,
        }));
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al cargar los productos.');
      }
    });
  }

  addToCart(product: Product): void {
    let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = cart.find(cartItem => cartItem.id === product.id);

    if (existingProduct) {
      existingProduct.quantity! += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // alert('Producto agregado al carrito.');
  }

  removeFromCart(product: Product): void {
    let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex(cartItem => cartItem.id === product.id);

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
    const existingProduct = cart.find(cartItem => cartItem.id === product.id);
    return existingProduct ? existingProduct.quantity! : 0;
  }

  checkout(): void {
    alert('Redirigiendo al proceso de compra...');
    this.router.navigate(['/cart']);
  }
}
