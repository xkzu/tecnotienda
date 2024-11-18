import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.initializeCarousel();
  }

  initializeCarousel(): void {
    const carouselElement = this.el.nativeElement.querySelector('#carouselExampleIndicators');
    if (carouselElement) {
      // Configuración adicional del carrusel
      this.renderer.setAttribute(carouselElement, 'data-bs-interval', '3000'); // Intervalo de transición de 3 segundos
      this.renderer.setAttribute(carouselElement, 'data-bs-ride', 'carousel'); // Inicia el carrusel automáticamente
    }
  }
}
