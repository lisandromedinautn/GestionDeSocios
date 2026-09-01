import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 1. Importar Router
import { SocioService } from '../services/socio.service';
import { EstadoService } from '../services/estado.service';
import { Socio, Estado } from '../models/socio.model';
import { filterSocios, sortSocios, paginate, getTotalPages } from './socio.utils';

@Component({
  selector: 'app-socio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css'],
})
export class SocioComponent implements OnInit {
  socios: Socio[] = [];
  private _searchTerm: string = '';
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.currentPage = 1;
  }

  // Filtro Estado - dinámico (Excel-like, OR interno)
  estados: Estado[] = [];
  selectedEstadoIds = new Set<number>();
  isEstadoFilterOpen = false;

  // Paginación
  currentPage = 1;
  pageSize = 20;

  // Ordenamiento - default apellido, configurable
  sortBy: 'apellido' | 'nombre' | 'dni' | 'numeroSocio' | 'estado' = 'apellido';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private readonly socioService: SocioService,
    private readonly estadoService: EstadoService,
    private readonly router: Router, // 2. Inyectar Router
  ) {}

  ngOnInit(): void {
    this.cargarSocios();
    this.cargarEstados();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-wrapper')) {
      this.isEstadoFilterOpen = false;
    }
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

  cargarEstados = (): void => {
    this.estadoService.findAll().subscribe({
      next: (data: Estado[]) => (this.estados = data),
      error: (err: unknown) => console.error('Error al cargar estados', err),
    });
  };

  // --- Filtro Estado helpers (Excel-like) ---
  toggleEstadoFilter(event?: MouseEvent): void {
    event?.stopPropagation();
    this.isEstadoFilterOpen = !this.isEstadoFilterOpen;
  }

  toggleEstado(id: number): void {
    if (this.selectedEstadoIds.has(id)) {
      this.selectedEstadoIds.delete(id);
    } else {
      this.selectedEstadoIds.add(id);
    }
    this.selectedEstadoIds = new Set(this.selectedEstadoIds);
    this.currentPage = 1;
  }

  isEstadoSelected(id: number): boolean {
    return this.selectedEstadoIds.has(id);
  }

  get isAllEstadosSelected(): boolean {
    return this.estados.length > 0 && this.selectedEstadoIds.size === this.estados.length;
  }

  get hasEstadoFilter(): boolean {
    return this.selectedEstadoIds.size > 0;
  }

  selectAllEstados(): void {
    this.estados.forEach((e) => this.selectedEstadoIds.add(e.id));
    this.selectedEstadoIds = new Set(this.selectedEstadoIds);
    this.currentPage = 1;
  }

  clearEstadoFilter(): void {
    this.selectedEstadoIds.clear();
    this.selectedEstadoIds = new Set(this.selectedEstadoIds);
    this.currentPage = 1;
  }

  get sociosFiltrados(): Socio[] {
    const filtrados = filterSocios(this.socios, this.selectedEstadoIds, this._searchTerm);
    return sortSocios(filtrados, this.sortBy, this.sortDir);
  }

  // --- Paginación ---
  get totalPages(): number {
    return getTotalPages(this.sociosFiltrados.length, this.pageSize);
  }

  get sociosPaginados(): Socio[] {
    return paginate(this.sociosFiltrados, this.currentPage, this.pageSize);
  }

  get paginationInfo(): string {
    if (this.sociosFiltrados.length === 0) return '0 socios';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(
      this.currentPage * this.pageSize,
      this.sociosFiltrados.length,
    );
    return `${start}-${end} de ${this.sociosFiltrados.length}`;
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];
    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy as typeof this.sortBy;
    this.currentPage = 1;
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
  }

  eliminarSocio = (id?: number): void => {
    if (id && confirm('¿Estás seguro de eliminar este socio?')) {
      this.socioService.deleteSocio(id).subscribe({
        next: () => {
          this.socios = this.socios.filter((s) => s.id !== id);
          if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        },
        error: (err: unknown) => console.error('Error al eliminar', err),
      });
    }
  };

  consultarSocio(socio: Socio) {
    this.router.navigate(['/socios/ver', socio.id]);
  }
}
