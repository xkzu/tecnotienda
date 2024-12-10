import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:8097/venta/add';

  constructor(private http: HttpClient) {}

  addVenta(venta: { usuarioId: number; productos: string; total: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }
}
