import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VentaService } from './venta.service';

describe('VentaService', () => {
  let service: VentaService;
  let httpMock: HttpTestingController;

  const mockVenta = {
    usuarioId: 1,
    productos: JSON.stringify([
      { nombre: 'Producto 1', precio: 100, cantidad: 2 },
      { nombre: 'Producto 2', precio: 50, cantidad: 1 }
    ]),
    total: 250
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VentaService]
    });
    service = TestBed.inject(VentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a sale', () => {
    service.addVenta(mockVenta).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne('http://localhost:8097/venta/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockVenta);

    req.flush({ success: true });
  });
});
