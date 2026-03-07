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
    if (!this.searchTerm) return this.socios;
    const term = this.searchTerm.toLowerCase();
    return this.socios.filter(
      (socio) =>
        socio.nombre.toLowerCase().includes(term) ||
        socio.apellido.toLowerCase().includes(term) ||
        socio.dni.toString().includes(term),
    );
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
