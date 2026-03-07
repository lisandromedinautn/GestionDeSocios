import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CajaService {
  private readonly API_URL = 'http://localhost:3000/caja';

  constructor(private http: HttpClient) {}

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  create(caja: any): Observable<any> {
    return this.http.post<any>(this.API_URL, caja);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}