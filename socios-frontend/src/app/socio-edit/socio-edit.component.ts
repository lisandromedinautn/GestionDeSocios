import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // Importante para peticiones paralelas
import { SocioService } from '../services/socio.service';
import { CajaService } from '../services/caja.service';
import { EstadoService } from '../services/estado.service';

@Component({
  selector: 'app-socio-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './socio-edit.component.html',
  styleUrl: './socio-edit.component.css',
})
export class SocioEditComponent implements OnInit {
  socioForm!: FormGroup;
  cargandoData = true;
  esEdicion = false;
  socioId?: number;

  // Listas dinámicas desde servicios
  cajas: any[] = [];
  estados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private socioService: SocioService,
    private cajaService: CajaService,
    private estadoService: EstadoService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.socioId = this.route.snapshot.params['id'];
    this.cargarTodo();
  }

  private cargarTodo(): void {
    this.cargandoData = true;

    // Preparamos las peticiones base
    const peticiones: any = {
      cajas: this.cajaService.findAll(),
      estados: this.estadoService.findAll()
    };

    // Si hay ID, añadimos la petición del socio
    if (this.socioId) {
      this.esEdicion = true;
      peticiones.socio = this.socioService.getSocio(this.socioId);
    }

    forkJoin(peticiones).subscribe({
      next: (res: any) => {
        this.cajas = res.cajas;
        this.estados = res.estados;

        if (this.esEdicion && res.socio) {
          this.poblarFormulario(res.socio);
        }
        
        this.cargandoData = false;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.cargandoData = false;
      }
    });
  }

  createForm() {
    this.socioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      dni: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      numeroSocio: [null, Validators.required],
      numeroBeneficio: [null, Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      caja: this.fb.group({ id: [null, Validators.required] }),
      estado: this.fb.group({ id: [null, Validators.required] }),
      direccion: this.fb.group({
        calle: ['', Validators.required],
        numero: ['', Validators.required],
        piso: [''],
        departamento: [''],
        barrio: ['', Validators.required],
        ciudad: ['', Validators.required],
      }),
      telefonos: this.fb.array([]),
    });
  }

  get telefonos(): FormArray {
    return this.socioForm.get('telefonos') as FormArray;
  }

  // Corregido a number según tu requerimiento anterior
  agregarTelefono(numero: number | string = '') {
    this.telefonos.push(
      this.fb.group({
        numero: [numero, [Validators.required, Validators.pattern('^[0-9]*$')]],
      })
    );
  }

  removerTelefono(i: number) {
    if (this.telefonos.length > 0) {
      this.telefonos.removeAt(i);
    }
  }

  private poblarFormulario(socio: any) {
    // Seteamos valores básicos y anidados
    this.socioForm.patchValue(socio);

    // Limpiar y llenar el FormArray de teléfonos
    this.telefonos.clear();
    if (socio.telefonos && socio.telefonos.length > 0) {
      socio.telefonos.forEach((t: any) => this.agregarTelefono(t.numero));
    } else {
      // Si no tiene teléfonos, al menos dejamos uno vacío como en el crear
      this.agregarTelefono();
    }
  }

  onSubmit() {
    if (this.socioForm.invalid) {
      this.socioForm.markAllAsTouched();
      return;
    }

    const datosSocio = this.socioForm.value;

    if (this.esEdicion && this.socioId) {
      this.socioService.updateSocio(this.socioId, datosSocio).subscribe({
        next: () => {
          alert('Socio actualizado con éxito'); // Alerta de éxito opcional
          this.router.navigate(['/socios']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          // Si el servidor (NestJS) devuelve un mensaje controlado, lo mostramos
          if (err.error && err.error.message) {
            alert('Error del servidor al actualizar: ' + err.error.message);
          } else {
            alert('Ocurrió un error inesperado al actualizar el socio.');
          }
        },
      });
    } else {
      // Por si acaso se usa este bloque para crear
      this.socioService.createSocio(datosSocio).subscribe({
        next: () => {
          alert('Socio creado con éxito');
          this.router.navigate(['/socios']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          if (err.error && err.error.message) {
            alert('Error del servidor: ' + err.error.message);
          } else {
            alert('Ocurrió un error al crear el socio.');
          }
        },
      });
    }
  }

  cancelar() {
    this.router.navigate(['/socios']);
  }
}