import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EstadoService } from '../services/estado.service';

@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.css',
})
export class EstadoComponent {
  nuevoEstado = {
    nombre: '',
    descripcion: '',
  };

  constructor(
    private estadoService: EstadoService,
    private router: Router,
  ) {}

  guardar(): void {
    if (!this.nuevoEstado.nombre) return;

    this.estadoService.create(this.nuevoEstado).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Error al crear el estado', err);
        alert('No se pudo guardar el estado. Inténtalo de nuevo.');
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin']);
  }
}
