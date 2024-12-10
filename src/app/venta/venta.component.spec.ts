import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentaComponent } from './venta.component';
import { VentaService } from '../services/venta.service';
import { UserStateService } from '../services/user-state.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

class MockVentaService {
  addVenta(venta: any) {
    return of({ message: 'Venta registrada exitosamente' });
  }
}

class MockUserStateService {
  getCurrentUser() {
    return { id: 1, nombre: 'Test User', email: 'test@example.com' };
  }
}

describe('VentaComponent', () => {
  let component: VentaComponent;
  let fixture: ComponentFixture<VentaComponent>;
  let mockVentaService: MockVentaService;
  let mockUserStateService: MockUserStateService;

  beforeEach(async () => {
    mockVentaService = new MockVentaService();
    mockUserStateService = new MockUserStateService();

    await TestBed.configureTestingModule({
      declarations: [VentaComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: VentaService, useValue: mockVentaService },
        { provide: UserStateService, useValue: mockUserStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current user ID', () => {
    component.ngOnInit();
    expect(component.venta.usuarioId).toBe(1);
  });

  it('should alert and redirect if user is not authenticated', () => {
    spyOn(mockUserStateService, 'getCurrentUser').and.returnValue(null as any);
    const hrefSpy = jasmine.createSpy();
    Object.defineProperty(window, 'location', {
      value: { href: hrefSpy },
      writable: true,
    });

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Usuario no autenticado. Redirigiendo...');
    expect(hrefSpy).toHaveBeenCalledWith('/login');
  });


  it('should call addVenta and reset form on successful guardarVenta', () => {
    spyOn(mockVentaService, 'addVenta').and.callThrough();
    spyOn(component, 'resetForm');
    spyOn(window, 'alert');

    component.venta = { usuarioId: 1, productos: 'Producto A', total: 100 };

    component.guardarVenta();
    expect(mockVentaService.addVenta).toHaveBeenCalledWith(component.venta);
    expect(component.resetForm).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Venta registrada exitosamente');
  });

  it('should alert if guardarVenta fails', () => {
    spyOn(mockVentaService, 'addVenta').and.returnValue(
      throwError(() => new Error('Error al registrar la venta'))
    );
    spyOn(window, 'alert');

    component.venta = { usuarioId: 1, productos: 'Producto A', total: 100 };

    component.guardarVenta();
    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al registrar la venta');
  });

  it('should reset the form after successful venta', () => {
    component.venta = { usuarioId: 1, productos: 'Producto A', total: 100 };
    component.resetForm();
    expect(component.venta.productos).toBe('');
    expect(component.venta.total).toBe(0);
    expect(component.venta.usuarioId).toBe(1);
  });

  it('should alert if required fields are missing', () => {
    spyOn(window, 'alert');
    component.venta = { usuarioId: 0, productos: '', total: 0 };
    component.guardarVenta();
    expect(window.alert).toHaveBeenCalledWith('Todos los campos son obligatorios');
  });
});
