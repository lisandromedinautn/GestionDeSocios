import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CajaService } from '../services/caja.service';
import { EstadoService } from '../services/estado.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  cajas: any[] = [];
  estados: any[] = [];

  constructor(
    private router: Router,
    private cajaService: CajaService,
    private estadoService: EstadoService,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cajaService.findAll().subscribe((data) => (this.cajas = data));
    this.estadoService.findAll().subscribe((data) => (this.estados = data));
  }

  // Funciones de Navegación
  irASocios(): void {
    this.router.navigate(['/socios']);
  }

  irACrearCaja(): void {
    this.router.navigate(['/caja']);
  }

  irACrearEstado(): void {
    this.router.navigate(['/estado']);
  }

  // Funciones de Eliminación
  eliminarCaja(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta caja?')) {
      this.cajaService.delete(id).subscribe({
        next: () => (this.cajas = this.cajas.filter((c) => c.id !== id)),
        error: (err) =>
          alert('No se puede eliminar la caja: tiene datos asociados.'),
      });
    }
  }

  eliminarEstado(id: number): void {
    if (confirm('¿Estás seguro de eliminar este estado?')) {
      this.estadoService.delete(id).subscribe({
        next: () => (this.estados = this.estados.filter((e) => e.id !== id)),
        error: (err) =>
          alert('No se puede eliminar el estado: tiene datos asociados.'),
      });
    }
  }
}
