import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 1. Importar Router
import { SocioService } from '../services/socio.service';
import { Socio } from '../models/socio.model';

@Component({
  selector: 'app-socio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css'],
})
export class SocioComponent implements OnInit {
  socios: Socio[] = [];
  searchTerm: string = '';

  constructor(
    private readonly socioService: SocioService,
    private readonly router: Router, // 2. Inyectar Router
  ) {}

  ngOnInit(): void {
    this.cargarSocios();
  }

  // 3. Método para redirección
  irACrearSocio(): void {
    this.router.navigate(['/socios/crear']);
  }

  irAAdmin(): void {
    this.router.navigate(['/admin']);
  }

  cargarSocios = (): void => {
    this.socioService.getSocios().subscribe({
      next: (data: Socio[]) => (this.socios = data),
      error: (err: unknown) => console.error('Error al cargar socios', err),
    });
  };

  get sociosFiltrados(): Socio[] {
    let filtrados = this.socios;

    // 1. Aplicamos el filtro si hay un término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      filtrados = this.socios.filter((socio) => {
        const nombre = socio.nombre.toLowerCase();
        const apellido = socio.apellido.toLowerCase();
        const dni = socio.dni.toString();

        return (
          apellido.startsWith(term) ||
          nombre.startsWith(term) ||
          dni.startsWith(term)
        );
      });
    }

    // 2. Ordenamos alfabéticamente por apellido
    return filtrados.sort((a, b) => {
      const apellidoA = a.apellido.toLowerCase();
      const apellidoB = b.apellido.toLowerCase();

      if (apellidoA < apellidoB) return -1;
      if (apellidoA > apellidoB) return 1;
      return 0;
    });
  }

  eliminarSocio = (id?: number): void => {
    if (id && confirm('¿Estás seguro de eliminar este socio?')) {
      this.socioService.deleteSocio(id).subscribe({
        next: () => (this.socios = this.socios.filter((s) => s.id !== id)),
        error: (err: unknown) => console.error('Error al eliminar', err),
      });
    }
  };

  consultarSocio(socio: Socio) {
    this.router.navigate(['/socios/ver', socio.id]);
  }
}
