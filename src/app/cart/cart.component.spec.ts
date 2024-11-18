import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { SharedModule } from '../shared/shared.module';
import { CartService } from '../services/cart.service';
import { UserStateService } from '../services/user-state.service';
import { Product } from '../models/product';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartComponent ],
      imports: [ SharedModule ],
      providers: [ CartService, UserStateService ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);

    // Inicializa el carrito con productos de prueba
    const testProducts: Product[] = [
      { name: 'Product 1', description: '', price: 1000, image: '', quantity: 2 },
      { name: 'Product 2', description: '', price: 1500, image: '', quantity: 2 }
    ];
    cartService['items'] = testProducts;

    fixture.detectChanges();
  });

  it('should calculate total price', () => {
    expect(component.getTotalPrice()).toBe(5000);
  });
});
