import { Component, OnInit } from '@angular/core';
import { VentaService } from '../services/venta.service';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html'
})
export class VentaComponent implements OnInit {
  venta = {
    usuarioId: 0, // Cambiado de null a 0
    productos: '',
    total: 0
  };

  constructor(
    private ventaService: VentaService,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userStateService.getCurrentUser();
    if (currentUser) {
      this.venta.usuarioId = currentUser.id; // Asigna el ID del usuario actual
    } else {
      alert('Usuario no autenticado. Redirigiendo...');
      // Redirige al usuario al login si no está autenticado
      window.location.href = '/login';
    }
  }

  guardarVenta(): void {
    if (this.venta.usuarioId === 0 || !this.venta.productos || this.venta.total <= 0) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.ventaService.addVenta(this.venta).subscribe({
      next: (response) => {
        alert('Venta registrada exitosamente');
        console.log(response);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al guardar la venta', error);
        alert('Ocurrió un error al registrar la venta');
      }
    });
  }

  resetForm(): void {
    this.venta = {
      usuarioId: this.venta.usuarioId, // Mantén el ID del usuario
      productos: '',
      total: 0
    };
  }
}
