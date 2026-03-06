import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { SocioService } from '../services/socio.service';
import { Socio } from '../models/socio.model';

@Component({
  selector: 'app-socio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css'],
})
export class SocioComponent implements OnInit {
  socioForm!: FormGroup;
  socios: Socio[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly socioService: SocioService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarSocios();
  }

  // Usamos funciones de flecha para asegurar que 'this' siempre sea SocioComponent
  // --- CONFIGURACIÓN DEL FORMULARIO ---
  private initForm = (): void => {
    this.socioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: [null, [Validators.required]],
      numeroBeneficio: [''],
      numeroSocio: [null],
      correoElectronico: ['', [Validators.required, Validators.email]],

      direccion: this.fb.group({
        calle: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        barrio: [''],
        ciudad: ['Villa María', [Validators.required]],
      }),

      telefonos: this.fb.array([
        this.fb.group({ numero: ['', [Validators.required]] }),
      ]),

      // IDs hardcodeados según tu backend
      caja: this.fb.group({ id: [1] }),
      estado: this.fb.group({ id: [1] }),
    });
  };

  // --- GETTERS ---
  get telefonos(): FormArray {
    return this.socioForm.get('telefonos') as FormArray;
  }

  // --- MANEJO DEL ARRAY DINÁMICO ---
  agregarTelefono = (): void => {
    this.telefonos.push(this.fb.group({ numero: ['', [Validators.required]] }));
  };

  eliminarTelefono = (index: number): void => {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  };

  // --- PETICIONES HTTP ---
  cargarSocios = (): void => {
    this.socioService.getSocios().subscribe({
      next: (data: Socio[]) => {
        this.socios = data;
      },
      error: (err: unknown) => {
        console.error('Error al cargar socios', err);
      },
    });
  };

  onSubmit = (): void => {
    if (this.socioForm.valid) {
      this.socioService.createSocio(this.socioForm.value).subscribe({
        next: (nuevoSocio: Socio) => {
          alert('¡Socio creado con éxito!');
          this.socios = [...this.socios, nuevoSocio]; // Inmutabilidad para disparar detección de cambios
          this.socioForm.reset();
          this.initForm();
        },
        error: (err: unknown) => {
          console.error('Error al crear socio', err);
        },
      });
    } else {
      alert('Por favor, completa los campos requeridos correctamente.');
      this.socioForm.markAllAsTouched(); // Marca errores visualmente
    }
  };

  eliminarSocio = (id?: number): void => {
    if (id && confirm('¿Estás seguro de eliminar este socio?')) {
      this.socioService.deleteSocio(id).subscribe({
        next: () => {
          this.socios = this.socios.filter((s) => s.id !== id);
        },
        error: (err: unknown) => {
          console.error('Error al eliminar', err);
        },
      });
    }
  };
}