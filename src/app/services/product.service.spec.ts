import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 1,
    nombre: 'Test Product',
    precio: '100',
    marca: 'Test Brand',
    descripcion: 'Test Description',
    imagen: 'test-image.jpg'
  };

  const mockProductList: Product[] = [
    {
      id: 1,
      nombre: 'Test Product 1',
      precio: '100',
      marca: 'Test Brand 1',
      descripcion: 'Test Description 1',
      imagen: 'test-image-1.jpg'
    },
    {
      id: 2,
      nombre: 'Test Product 2',
      precio: '200',
      marca: 'Test Brand 2',
      descripcion: 'Test Description 2',
      imagen: 'test-image-2.jpg'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product', () => {
    service.addProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:8096/productos/agregar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should fetch a list of products', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProductList);
    });

    const req = httpMock.expectOne('http://localhost:8096/productos/listar');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductList);
  });
});
