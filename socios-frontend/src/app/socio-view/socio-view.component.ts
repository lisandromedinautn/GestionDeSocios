import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SocioService } from '../services/socio.service';
import { CuotaService } from '../services/cuota.service';
import { Socio, Cuota } from '../models/socio.model';

@Component({
  selector: 'app-socio-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './socio-view.component.html',
  styleUrl: './socio-view.component.css',
})
export class SocioViewComponent implements OnInit {
  socio?: Socio;
  loading = true;
  cuotas: Cuota[] = [];
  anioActual = new Date().getFullYear();
  mesesLabels = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socioService: SocioService,
    private cuotaService: CuotaService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.socioService.getSocio(+id).subscribe({
        next: (data) => {
          this.socio = data;
          this.loading = false;
          // Usamos el id directamente de la respuesta 'data'
          if (data.id) {
            this.cargarCuotas(data.id, this.anioActual);
          }
        },
        error: () => this.router.navigate(['/socios']),
      });
    }
  }

  cargarCuotas(socioId: number, anio: number) {
    this.cuotaService.getCuotasAnuales(socioId, anio).subscribe({
      next: (data) => {
        this.cuotas = data;
      },
      error: (err) => console.error('Error al cargar cuotas', err),
    });
  }

  cambiarAnio(delta: number) {
    this.anioActual += delta;
    // Validamos que exista el socio y su ID antes de llamar
    if (this.socio && this.socio.id) {
      this.cargarCuotas(this.socio.id, this.anioActual);
    }
  }

  ejecutarGeneracion() {
    this.cuotaService.generarCuotas(this.anioActual).subscribe({
      next: () => {
        // Validamos que exista el socio y su ID antes de recargar
        if (this.socio && this.socio.id) {
          this.cargarCuotas(this.socio.id, this.anioActual);
        }
      },
      error: (err) => console.error('Error al generar', err),
    });
  }

  toggleEstadoCuota(cuota: Cuota) {
    this.cuotaService.togglePago(cuota.id).subscribe({
      next: (updated) => {
        cuota.isPagado = updated.isPagado;
      },
      error: (err) => console.error('Error al cambiar estado', err),
    });
  }

  irAEditar(id: number) {
    this.router.navigate(['/socios/editar', id]);
  }

  volver() {
    this.router.navigate(['/socios']);
  }
}
