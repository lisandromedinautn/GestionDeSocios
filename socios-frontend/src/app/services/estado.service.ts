// src/app/servicios/estado.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private readonly API_URL = 'http://localhost:3000/estado';

  constructor(private http: HttpClient) {}

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  create(estado: any): Observable<any> {
    return this.http.post<any>(this.API_URL, estado);
  }
}