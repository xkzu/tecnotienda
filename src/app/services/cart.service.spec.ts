import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to the cart', () => {
    const product: Product = {
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      marca: 'Marca Test',
      descripcion: 'Descripción Test',
      imagen: 'imagen.jpg',
      quantity: 0
    };

    service.addToCart(product);
    const items = service.getItems();
    expect(items.length).toBe(1);
    expect(items[0].nombre).toBe('Test Product');
    expect(items[0].quantity).toBe(1);
  });

  it('should increment quantity if product already exists in the cart', () => {
    const product: Product = {
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      marca: 'Marca Test',
      descripcion: 'Descripción Test',
      imagen: 'imagen.jpg',
      quantity: 0
    };

    service.addToCart(product);
    service.addToCart(product);
    const items = service.getItems();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should remove a product from the cart', () => {
    const product: Product = {
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      marca: 'Marca Test',
      descripcion: 'Descripción Test',
      imagen: 'imagen.jpg',
      quantity: 0
    };

    service.addToCart(product);
    service.removeFromCart(product);
    const items = service.getItems();
    expect(items.length).toBe(0);
  });

  it('should decrement quantity if product quantity is greater than 1', () => {
    const product: Product = {
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      marca: 'Marca Test',
      descripcion: 'Descripción Test',
      imagen: 'imagen.jpg',
      quantity: 0
    };

    service.addToCart(product);
    service.addToCart(product);
    service.removeFromCart(product);
    const items = service.getItems();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(1);
  });

  it('should clear the cart', () => {
    const product1: Product = {
      id: 1,
      nombre: 'Product 1',
      precio: 100,
      marca: 'Marca 1',
      descripcion: 'Descripción 1',
      imagen: 'imagen1.jpg',
      quantity: 0
    };

    const product2: Product = {
      id: 2,
      nombre: 'Product 2',
      precio: 200,
      marca: 'Marca 2',
      descripcion: 'Descripción 2',
      imagen: 'imagen2.jpg',
      quantity: 0
    };

    service.addToCart(product1);
    service.addToCart(product2);
    service.clearCart();
    const items = service.getItems();
    expect(items.length).toBe(0);
  });
});
