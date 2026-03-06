import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socio } from '../models/socio.model'; // Ajusta la ruta a tu interfaz

@Injectable({
  providedIn: 'root',
})
export class SocioService {
  // Nota: Usamos '/socio' tal cual lo definiste en tu @Controller('socio')
  private API_URL = 'http://localhost:3000/socio';

  constructor(private http: HttpClient) {}

  getSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.API_URL);
  }

  getSocio(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.API_URL}/${id}`);
  }

  createSocio(socio: Socio): Observable<Socio> {
    return this.http.post<Socio>(this.API_URL, socio);
  }

  updateSocio(id: number, socio: Partial<Socio>): Observable<Socio> {
    return this.http.patch<Socio>(`${this.API_URL}/${id}`, socio);
  }

  deleteSocio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
