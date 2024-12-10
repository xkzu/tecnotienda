import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockProductService {
  addProduct(product: any) {
    return of(product);
  }
}

class MockRouter {
  navigate(path: string[]) {
    return path;
  }
}

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProductComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('nombre')).toBeTruthy();
    expect(component.productForm.get('precio')).toBeTruthy();
    expect(component.productForm.get('marca')).toBeTruthy();
    expect(component.productForm.get('descripcion')).toBeTruthy();
    expect(component.productForm.get('imagen')).toBeTruthy();
  });

  it('should validate the form fields', () => {
    const form = component.productForm;
    form.get('nombre')?.setValue('');
    form.get('precio')?.setValue('');
    form.get('marca')?.setValue('');
    form.get('descripcion')?.setValue('');
    form.get('imagen')?.setValue('');

    expect(form.valid).toBeFalse();

    form.get('nombre')?.setValue('Producto');
    form.get('precio')?.setValue('100.00');
    form.get('marca')?.setValue('Marca');
    form.get('descripcion')?.setValue('Descripción del producto');
    form.get('imagen')?.setValue('http://imagen.jpg');

    expect(form.valid).toBeTrue();
  });

  it('should call ProductService on form submission', () => {
    const productService = TestBed.inject(ProductService);
    spyOn(productService, 'addProduct').and.callThrough();

    const form = component.productForm;
    form.get('nombre')?.setValue('Producto');
    form.get('precio')?.setValue('100.00');
    form.get('marca')?.setValue('Marca');
    form.get('descripcion')?.setValue('Descripción del producto');
    form.get('imagen')?.setValue('http://imagen.jpg');

    component.onSubmit();

    expect(productService.addProduct).toHaveBeenCalledWith(form.value);
  });

  it('should navigate to products on successful product creation', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const form = component.productForm;
    form.get('nombre')?.setValue('Producto');
    form.get('precio')?.setValue('100.00');
    form.get('marca')?.setValue('Marca');
    form.get('descripcion')?.setValue('Descripción del producto');
    form.get('imagen')?.setValue('http://imagen.jpg');

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should handle errors during product creation', () => {
    const productService = TestBed.inject(ProductService);
    spyOn(productService, 'addProduct').and.returnValue(
      throwError(() => new Error('Error al crear el producto'))
    );
    spyOn(window, 'alert');

    const form = component.productForm;
    form.get('nombre')?.setValue('Producto');
    form.get('precio')?.setValue('100.00');
    form.get('marca')?.setValue('Marca');
    form.get('descripcion')?.setValue('Descripción del producto');
    form.get('imagen')?.setValue('http://imagen.jpg');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al crear el producto.');
  });
});
