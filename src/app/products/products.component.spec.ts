import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../models/product';
import { CustomCurrencyPipe } from '../pipes/custom-currency.pipe'; // Asegúrate de importar el pipe

class MockProductService {
  getProducts() {
    return of([
      {
        id: 1,
        nombre: 'Product 1',
        marca: 'Brand 1',
        descripcion: 'Description 1',
        precio: '100.00',
        imagen: 'image1.jpg'
      },
      {
        id: 2,
        nombre: 'Product 2',
        marca: 'Brand 2',
        descripcion: 'Description 2',
        precio: '200.00',
        imagen: 'image2.jpg'
      }
    ]);
  }
}

class MockRouter {
  navigate(path: string[]) {
    return path;
  }
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let mockLocalStorage: { [key: string]: string } = {};

  beforeEach(async () => {
    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      mockLocalStorage[key] = value;
    });

    spyOn(localStorage, 'getItem').and.callFake((key) => mockLocalStorage[key] || null);

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, CustomCurrencyPipe], // Agrega el pipe aquí
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    spyOn(TestBed.inject(ProductService), 'getProducts').and.callThrough();
    component.fetchProducts();
    expect(component.products.length).toBe(2);
    expect(component.products[0].nombre).toBe('Product 1');
  });

  it('should handle fetch products error', () => {
    spyOn(TestBed.inject(ProductService), 'getProducts').and.returnValue(
      throwError(() => new Error('Error loading products'))
    );
    spyOn(window, 'alert');
    component.fetchProducts();
    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al cargar los productos.');
  });

  it('should add a product to the cart', () => {
    const product: Product = {
      id: 1,
      nombre: 'Product 1',
      marca: 'Brand 1',
      descripcion: 'Description 1',
      precio: 100,
      imagen: 'image1.jpg',
      quantity: 0
    };

    component.addToCart(product);
    const cart = JSON.parse(mockLocalStorage['cart']);
    expect(cart.length).toBe(1);
    expect(cart[0].nombre).toBe('Product 1');
    expect(cart[0].quantity).toBe(1);
  });

  it('should remove a product from the cart', () => {
    mockLocalStorage['cart'] = JSON.stringify([
      { id: 1, nombre: 'Product 1', quantity: 2 }
    ]);

    const product: Product = {
      id: 1,
      nombre: 'Product 1',
      marca: 'Brand 1',
      descripcion: 'Description 1',
      precio: 100,
      imagen: 'image1.jpg',
      quantity: 0
    };

    component.removeFromCart(product);
    const cart = JSON.parse(mockLocalStorage['cart']);
    expect(cart[0].quantity).toBe(1);
  });

  it('should calculate the correct product quantity in cart', () => {
    mockLocalStorage['cart'] = JSON.stringify([
      { id: 1, nombre: 'Product 1', quantity: 3 }
    ]);

    const product: Product = {
      id: 1,
      nombre: 'Product 1',
      marca: 'Brand 1',
      descripcion: 'Description 1',
      precio: 100,
      imagen: 'image1.jpg',
      quantity: 0
    };

    const quantity = component.getProductQuantity(product);
    expect(quantity).toBe(3);
  });

  it('should navigate to cart on checkout', () => {
    spyOn(TestBed.inject(Router), 'navigate');
    component.checkout();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/cart']);
  });
});
