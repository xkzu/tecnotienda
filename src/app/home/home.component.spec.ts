import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Renderer2, ElementRef } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockElementRef: ElementRef;
  let mockRenderer: Renderer2;

  beforeEach(async () => {
    // Crear mocks para ElementRef y Renderer2
    mockElementRef = {
      nativeElement: {
        querySelector: jasmine.createSpy('querySelector').and.returnValue({
          setAttribute: jasmine.createSpy('setAttribute'),
        }),
      },
    } as any;

    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: Renderer2, useValue: mockRenderer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the carousel', () => {
    component.initializeCarousel();
    expect(mockElementRef.nativeElement.querySelector).toHaveBeenCalledWith('#carouselExampleIndicators');
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
      jasmine.any(Object),
      'data-bs-interval',
      '3000'
    );
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
      jasmine.any(Object),
      'data-bs-ride',
      'carousel'
    );
  });

  it('should not fail if carousel element is not found', () => {
    mockElementRef.nativeElement.querySelector.and.returnValue(null); // Simular que no encuentra el elemento
    expect(() => component.initializeCarousel()).not.toThrow();
  });
});
