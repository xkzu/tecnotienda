import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { SharedModule } from '../shared/shared.module';
import { CartService } from '../services/cart.service';
import { UserStateService } from '../services/user-state.service';
import { Product } from '../models/product';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [SharedModule],
      providers: [CartService, UserStateService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product list', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('.card').length).toBe(component.products.length);
  });

  it('should add product to cart', () => {
    const product = component.products[0];
    spyOn(component, 'addToCart');
    const button = fixture.nativeElement.querySelector('.btn-success');
    button.click();
    expect(component.addToCart).toHaveBeenCalledWith(product);
  });
});
