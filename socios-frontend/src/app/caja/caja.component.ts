import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CajaService } from '../services/caja.service';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.css',
})
export class CajaComponent {
  // Modelo inicial siguiendo tu entidad de TypeORM
  nuevaCaja = {
    nombre: '',
    descripcion: '',
  };

  constructor(
    private cajaService: CajaService,
    private router: Router,
  ) {}

  guardar(): void {
    if (!this.nuevaCaja.nombre) return;

    this.cajaService.create(this.nuevaCaja).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Error al crear la caja', err);
        alert('Hubo un error al guardar la caja.');
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin']);
  }
}
