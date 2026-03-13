// src/app/services/cuota.service.ts
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuota } from '../models/socio.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CuotaService {
  private API_URL = 'http://localhost:3000/cuota';

  constructor(private http: HttpClient) {}

  getCuotasAnuales(socioId: number, anio: number): Observable<Cuota[]> {
    return this.http.get<Cuota[]>(`${this.API_URL}/${socioId}/${anio}`);
  }

  togglePago(id: number): Observable<Cuota> {
    return this.http.patch<Cuota>(`${this.API_URL}/toggle/${id}`, {});
  }

  generarCuotas(anio: number): Observable<any> {
    return this.http.post(`${this.API_URL}/generar-cuotas/${anio}`, {});
  }
}
