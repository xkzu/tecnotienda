import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { UserStateService } from '../services/user-state.service';
import { VentaService } from '../services/venta.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../models/product';
import { CustomCurrencyPipe } from '../pipes/custom-currency.pipe';

class MockUserStateService {
  getCurrentUser() {
    return { id: 1, nombre: 'Test User', admin: false };
  }
}

class MockVentaService {
  addVenta(venta: any) {
    return of(venta);
  }
}

class MockRouter {
  navigate(path: string[]) {
    return path;
  }
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent, CustomCurrencyPipe], // Añadido CustomCurrencyPipe
      providers: [
        { provide: UserStateService, useClass: MockUserStateService },
        { provide: VentaService, useClass: MockVentaService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify([
        {
          id: 1,
          nombre: 'Test Product',
          precio: 100,
          quantity: 2,
          marca: 'Marca 1',
          descripcion: 'Descripcion 1',
          imagen: 'image1.jpg',
        },
      ])
    );
    component.loadCart();
    expect(component.cartItems.length).toBe(1);
    expect(component.cartItems[0].nombre).toBe('Test Product');
  });

  it('should calculate total price', () => {
    component.cartItems = [
      {
        id: 1,
        nombre: 'Product 1',
        precio: 100,
        quantity: 2,
        marca: 'Marca 1',
        descripcion: 'Descripcion 1',
        imagen: 'image1.jpg',
      },
      {
        id: 2,
        nombre: 'Product 2',
        precio: 50,
        quantity: 1,
        marca: 'Marca 2',
        descripcion: 'Descripcion 2',
        imagen: 'image2.jpg',
      },
    ];
    component.calculateTotal();
    expect(component.totalAmount).toBe(250);
  });

  it('should add product to cart', () => {
    const product: Product = {
      id: 3,
      nombre: 'New Product',
      precio: 200,
      marca: 'Marca 3',
      descripcion: 'Descripcion 3',
      imagen: 'image3.jpg',
    };
    component.addToCart(product);
    expect(component.cartItems.length).toBe(1);
    expect(component.cartItems[0].nombre).toBe('New Product');
    expect(component.cartItems[0].quantity).toBe(1);
  });

  it('should remove product from cart', () => {
    const product: Product = {
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      quantity: 2,
      marca: 'Marca 1',
      descripcion: 'Descripcion 1',
      imagen: 'image1.jpg',
    };
    component.cartItems = [product];
    component.removeFromCart(product);
    expect(component.cartItems[0].quantity).toBe(1);
  });

  it('should clear the cart', () => {
    component.cartItems = [
      {
        id: 1,
        nombre: 'Product 1',
        precio: 100,
        quantity: 1,
        marca: 'Marca 1',
        descripcion: 'Descripcion 1',
        imagen: 'image1.jpg',
      },
      {
        id: 2,
        nombre: 'Product 2',
        precio: 50,
        quantity: 1,
        marca: 'Marca 2',
        descripcion: 'Descripcion 2',
        imagen: 'image2.jpg',
      },
    ];
    component.clearCart();
    expect(component.cartItems.length).toBe(0);
  });

  it('should call ventaService on handlePayment', () => {
    spyOn(component['ventaService'], 'addVenta').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify([
        {
          id: 1,
          nombre: 'Test Product',
          precio: 100,
          quantity: 2,
          marca: 'Marca 1',
          descripcion: 'Descripcion 1',
          imagen: 'image1.jpg',
        },
      ])
    );
    component.loadCart();
    component.handlePayment({ cardNumber: '1234', cardName: 'Test', cvv: '123' });
    expect(component['ventaService'].addVenta).toHaveBeenCalled();
  });
});
