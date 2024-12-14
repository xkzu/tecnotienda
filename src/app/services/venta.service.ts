import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = `${environment.apiUrlVenta}/venta/add`;

  constructor(private http: HttpClient) {}

  addVenta(venta: { usuarioId: number; productos: string; total: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }
}
